import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { optimize } from "svgo";

type CliOptions = {
  inputDir: string;
  contentDir: string;
  quality: number;
  recursive: boolean;
  deleteOriginal: boolean;
  updateContent: boolean;
  maxWidth?: number;
  maxHeight?: number;
};

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".svg"]);

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    inputDir: "public/assets/uploads",
    contentDir: "content",
    quality: 75,
    recursive: false,
    deleteOriginal: false,
    updateContent: true
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const nextArg = argv[i + 1];

    if (arg === "--input" && typeof nextArg === "string") {
      options.inputDir = nextArg;
      i += 1;
      continue;
    }

    if (arg === "--quality" && typeof nextArg === "string") {
      options.quality = Number(nextArg);
      i += 1;
      continue;
    }

    if (arg === "--content-dir" && typeof nextArg === "string") {
      options.contentDir = nextArg;
      i += 1;
      continue;
    }

    if (arg === "--max-width" && typeof nextArg === "string") {
      options.maxWidth = Number(nextArg);
      i += 1;
      continue;
    }

    if (arg === "--max-height" && typeof nextArg === "string") {
      options.maxHeight = Number(nextArg);
      i += 1;
      continue;
    }

    if (arg === "--recursive") {
      options.recursive = true;
      continue;
    }

    if (arg === "--delete-original") {
      options.deleteOriginal = true;
      continue;
    }

    if (arg === "--no-update-content") {
      options.updateContent = false;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  if (!Number.isInteger(options.quality) || options.quality < 1 || options.quality > 100) {
    throw new Error("Nilai --quality harus 1..100");
  }

  if (options.maxWidth !== undefined && (!Number.isInteger(options.maxWidth) || options.maxWidth < 1)) {
    throw new Error("Nilai --max-width harus integer >= 1");
  }

  if (options.maxHeight !== undefined && (!Number.isInteger(options.maxHeight) || options.maxHeight < 1)) {
    throw new Error("Nilai --max-height harus integer >= 1");
  }

  return options;
}

function printHelp(): void {
  console.log(`Convert + compress image ke WebP (Bun + sharp + svgo)\n\nUsage:\n  bun run scripts/convert-webp.ts [opsi]\n\nOpsi:\n  --input <dir>          Folder sumber gambar (default: public/assets/uploads)\n  --content-dir <dir>    Folder konten yang akan diupdate (default: content)\n  --quality <1-100>      Quality WebP (default: 75)\n  --max-width <angka>    Resize maksimum lebar\n  --max-height <angka>   Resize maksimum tinggi\n  --recursive            Scan subfolder input\n  --delete-original      Hapus file asli setelah sukses\n  --no-update-content    Jangan ubah referensi gambar di konten\n  --help, -h             Tampilkan bantuan\n`);
}

async function collectFiles(dir: string, recursive: boolean): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (recursive) {
        files.push(...(await collectFiles(fullPath, recursive)));
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (SUPPORTED_EXTENSIONS.has(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function collectContentFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectContentFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".md") {
      files.push(fullPath);
    }
  }

  return files;
}

function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function outputWebpPath(filePath: string): string {
  const parsed = path.parse(filePath);
  return path.join(parsed.dir, `${parsed.name}.webp`);
}

function toPosixRelativePath(absPath: string): string {
  return path.relative(process.cwd(), absPath).split(path.sep).join("/");
}

function webPathCandidates(absPath: string): string[] {
  const relPath = toPosixRelativePath(absPath);
  const candidates = new Set<string>();

  candidates.add(`/${relPath}`);
  candidates.add(relPath);

  if (relPath.startsWith("public/")) {
    const withoutPublic = relPath.slice("public/".length);
    candidates.add(`/${withoutPublic}`);
    candidates.add(withoutPublic);
  }

  return [...candidates];
}

function replaceExtWithWebp(webPath: string): string {
  return webPath.replace(/\.[^./]+$/, ".webp");
}

function buildResizeOption(maxWidth?: number, maxHeight?: number): sharp.ResizeOptions | undefined {
  if (!maxWidth && !maxHeight) {
    return undefined;
  }

  return {
    width: maxWidth,
    height: maxHeight,
    fit: "inside",
    withoutEnlargement: true
  };
}

async function convertRasterToWebp(
  sourceFile: string,
  targetFile: string,
  quality: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<void> {
  const resizeOption = buildResizeOption(maxWidth, maxHeight);

  let pipeline = sharp(sourceFile, { failOn: "none" }).rotate();
  if (resizeOption) {
    pipeline = pipeline.resize(resizeOption);
  }

  await pipeline.webp({ quality }).toFile(targetFile);
}

async function convertSvgToWebp(
  sourceFile: string,
  targetFile: string,
  quality: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<void> {
  const svgContent = await Bun.file(sourceFile).text();
  const optimizedSvg = optimize(svgContent, {
    path: sourceFile,
    multipass: true,
    plugins: ["preset-default"]
  });

  const resizeOption = buildResizeOption(maxWidth, maxHeight);

  let pipeline = sharp(Buffer.from(optimizedSvg.data)).rotate();
  if (resizeOption) {
    pipeline = pipeline.resize(resizeOption);
  }

  await pipeline.webp({ quality }).toFile(targetFile);
}

async function convertOneFile(filePath: string, options: CliOptions): Promise<{ before: number; after: number }> {
  const targetFile = outputWebpPath(filePath);
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".svg") {
    await convertSvgToWebp(filePath, targetFile, options.quality, options.maxWidth, options.maxHeight);
  } else {
    await convertRasterToWebp(filePath, targetFile, options.quality, options.maxWidth, options.maxHeight);
  }

  const sourceStat = await stat(filePath);
  const targetStat = await stat(targetFile);

  if (options.deleteOriginal) {
    await rm(filePath);
  }

  return {
    before: sourceStat.size,
    after: targetStat.size
  };
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function updateContentReferences(contentDir: string, convertedMap: Map<string, string>): Promise<number> {
  const contentStat = await stat(contentDir).catch(() => null);
  if (!contentStat || !contentStat.isDirectory()) {
    return 0;
  }

  const contentFiles = await collectContentFiles(contentDir);
  if (contentFiles.length === 0 || convertedMap.size === 0) {
    return 0;
  }

  let updatedCount = 0;

  for (const contentFile of contentFiles) {
    const originalText = await readFile(contentFile, "utf8");
    let updatedText = originalText;

    for (const [fromPath, toPath] of convertedMap.entries()) {
      const pattern = new RegExp(escapeRegExp(fromPath), "g");
      updatedText = updatedText.replace(pattern, toPath);
    }

    if (updatedText !== originalText) {
      await writeFile(contentFile, updatedText, "utf8");
      updatedCount += 1;
      console.log(`[CONTENT] Updated: ${path.relative(process.cwd(), contentFile)}`);
    }
  }

  return updatedCount;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(process.cwd(), options.inputDir);

  const inputStat = await stat(inputPath).catch(() => null);
  if (!inputStat || !inputStat.isDirectory()) {
    throw new Error(`Folder tidak ditemukan: ${inputPath}`);
  }

  const files = await collectFiles(inputPath, options.recursive);
  if (files.length === 0) {
    console.log(`Tidak ada file jpg/jpeg/png/svg di: ${inputPath}`);
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;
  const convertedMap = new Map<string, string>();

  for (const filePath of files) {
    const targetName = path.basename(outputWebpPath(filePath));

    try {
      const result = await convertOneFile(filePath, options);
      totalBefore += result.before;
      totalAfter += result.after;

      for (const sourcePath of webPathCandidates(filePath)) {
        convertedMap.set(sourcePath, replaceExtWithWebp(sourcePath));
      }

      const savedPercent = result.before > 0 ? ((1 - result.after / result.before) * 100).toFixed(2) : "0.00";

      console.log(
        `[OK] ${path.basename(filePath)} -> ${targetName} | ${formatKb(result.before)} -> ${formatKb(result.after)} | Hemat ${savedPercent}%`
      );
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.error(`[FAIL] ${filePath} | ${reason}`);
    }
  }

  const summarySaved = totalBefore > 0 ? ((1 - totalAfter / totalBefore) * 100).toFixed(2) : "0.00";
  let updatedContentFiles = 0;

  if (options.updateContent) {
    const contentPath = path.resolve(process.cwd(), options.contentDir);
    updatedContentFiles = await updateContentReferences(contentPath, convertedMap);
  }

  console.log("\nSelesai");
  console.log(`Total sebelum: ${formatKb(totalBefore)}`);
  console.log(`Total sesudah: ${formatKb(totalAfter)}`);
  console.log(`Total hemat: ${summarySaved}%`);
  if (options.updateContent) {
    console.log(`File konten terupdate: ${updatedContentFiles}`);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
});
