import type { GitHubContentFileEntry, ProductContent, ProductionHouseContent } from "../types/content";

const GITHUB_OWNER = import.meta.env.VITE_CONTENT_GITHUB_OWNER ?? "pengikut-raja-capybara";
const GITHUB_REPO = import.meta.env.VITE_CONTENT_GITHUB_REPO ?? "sentra-genteng-bogorejo";
const GITHUB_BRANCH = import.meta.env.VITE_CONTENT_GITHUB_BRANCH ?? "content";
const GITHUB_BASE_PATH = import.meta.env.VITE_CONTENT_BASE_PATH ?? "content";

const PRODUCT_FOLDER = "produk";
const PRODUCTION_HOUSE_FOLDER = "rumah_produksi";
const LATEST_REF_CACHE_TTL_MS = 60 * 1000;
const CONTENT_IMAGE_PROXY = import.meta.env.VITE_CONTENT_IMAGE_PROXY ?? "weserv";
const CONTENT_IMAGE_QUALITY = Number(import.meta.env.VITE_CONTENT_IMAGE_QUALITY ?? "75");
const CONTENT_IMAGE_WIDTH = Number(import.meta.env.VITE_CONTENT_IMAGE_WIDTH ?? "1200");
const SIMULATE_ALL_CDN_DOWN = import.meta.env.VITE_SIMULATE_ALL_CDN_DOWN === "true";

let latestContentRefCache: {
  ref: string;
  fetchedAt: number;
} | null = null;

type JsDelivrFlatFileEntry = {
  name: string;
  hash: string;
  size: number;
};

type JsDelivrFlatResponse = {
  files: JsDelivrFlatFileEntry[];
};

type GitHubBranchResponse = {
  commit: {
    sha: string;
  };
};

type GitHubContentFileResponse = {
  type: "file" | "dir";
  content?: string;
  encoding?: string;
};

type CmsProductContent = {
  prd_id: string;
  prd_nama: string;
  prd_spesifikasi: string;
  prd_kebutuhan_m2: string;
  prd_harga_grosir: string;
  prd_harga_eceran: string;
  prd_image: string[];
};

type CmsProductionHouseContent = {
  rmp_id: string;
  rmp_nama: string;
  rmp_alamat: string;
  rmp_kapasitas_cetak: string;
  rmp_kapasitas_tungku: string;
  rmp_pekerja: string;
  rmp_stok_dormant: string;
  rmp_foto: string[];
};

const buildContentsApiUrl = (path: string) => {
  const encodedPath = encodeURI(path);
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodedPath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;
};

const buildBranchApiUrl = () => {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches/${encodeURIComponent(GITHUB_BRANCH)}`;
};

const buildRawUrl = (path: string, ref: string = GITHUB_BRANCH) => {
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://cdn.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}@${encodeURIComponent(ref)}/${encodedPath}`;
};

const buildGitHubRawUrl = (path: string, ref: string = GITHUB_BRANCH) => {
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${encodeURIComponent(ref)}/${encodedPath}`;
};

const buildJsDelivrFlatApiUrl = (ref: string = GITHUB_BRANCH) => {
  return `https://data.jsdelivr.com/v1/package/gh/${GITHUB_OWNER}/${GITHUB_REPO}@${encodeURIComponent(ref)}/flat`;
};

const isAbsoluteHttpUrl = (value: string) => {
  return value.startsWith("http://") || value.startsWith("https://");
};

const CDN_HOSTS = new Set([
  "cdn.jsdelivr.net",
  "data.jsdelivr.com",
  "raw.githubusercontent.com",
  "images.weserv.nl",
  "cdn.statically.io",
]);

const isCdnUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return CDN_HOSTS.has(parsedUrl.host);
  } catch {
    return false;
  }
};

const decodeBase64Utf8 = (base64Value: string): string => {
  const normalized = base64Value.replace(/\s+/g, "");
  const binaryValue = atob(normalized);
  const bytes = Uint8Array.from(binaryValue, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
};

const buildWeservUrl = (sourceUrl: string): string => {
  const parsed = new URL(sourceUrl);
  const weservSource = `${parsed.protocol === "https:" ? "ssl:" : ""}${parsed.host}${parsed.pathname}${parsed.search}`;
  const params = new URLSearchParams({
    url: weservSource,
    q: Number.isFinite(CONTENT_IMAGE_QUALITY) ? String(CONTENT_IMAGE_QUALITY) : "75",
    output: "webp",
  });

  if (Number.isFinite(CONTENT_IMAGE_WIDTH) && CONTENT_IMAGE_WIDTH > 0) {
    params.set("w", String(CONTENT_IMAGE_WIDTH));
  }

  return `https://images.weserv.nl/?${params.toString()}`;
};

const buildStaticallyUrl = (sourceUrl: string): string => {
  const normalizedSource = sourceUrl.replace(/^https?:\/\//, "");
  const params = new URLSearchParams({
    quality: Number.isFinite(CONTENT_IMAGE_QUALITY) ? String(CONTENT_IMAGE_QUALITY) : "75",
    f: "auto",
  });

  return `https://cdn.statically.io/img/${encodeURIComponent(normalizedSource)}?${params.toString()}`;
};

const toOptimizedImageUrl = (sourceUrl: string): string => {
  try {
    if (CONTENT_IMAGE_PROXY === "none") {
      return sourceUrl;
    }

    if (CONTENT_IMAGE_PROXY === "statically") {
      return buildStaticallyUrl(sourceUrl);
    }

    return buildWeservUrl(sourceUrl);
  } catch (error) {
    console.warn("Failed to build optimized image URL, fallback to source URL", error);
    return sourceUrl;
  }
};

export const resolveContentAssetUrl = (assetPath: string): string => {
  const trimmedPath = assetPath.trim();

  if (trimmedPath.length === 0) {
    return "";
  }

  if (!isAbsoluteHttpUrl(trimmedPath)) {
    const normalized = trimmedPath.replace(/^\/+/, "");
    const prefixedPath = normalized.startsWith("assets/") ? `public/${normalized}` : normalized;

    return toOptimizedImageUrl(buildRawUrl(prefixedPath));
  }

  return toOptimizedImageUrl(trimmedPath);
};

const parseJsonContent = <T>(rawText: string, sourcePath: string): T => {
  try {
    return JSON.parse(rawText.trim()) as T;
  } catch (error) {
    throw new Error(`Content at ${sourcePath} is not valid JSON`, { cause: error });
  }
};

const fetchJson = async <T>(url: string): Promise<T> => {
  if (SIMULATE_ALL_CDN_DOWN && isCdnUrl(url)) {
    throw new Error(`Simulated CDN outage for ${url}`);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) to ${url}`);
  }

  return (await response.json()) as T;
};

const fetchText = async (url: string): Promise<string> => {
  if (SIMULATE_ALL_CDN_DOWN && isCdnUrl(url)) {
    throw new Error(`Simulated CDN outage for ${url}`);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) to ${url}`);
  }

  return response.text();
};

const getLatestContentRef = async (): Promise<string> => {
  const now = Date.now();

  if (latestContentRefCache && now - latestContentRefCache.fetchedAt < LATEST_REF_CACHE_TTL_MS) {
    return latestContentRefCache.ref;
  }

  try {
    const branchResponse = await fetchJson<GitHubBranchResponse>(buildBranchApiUrl());
    const ref = branchResponse.commit.sha;

    latestContentRefCache = {
      ref,
      fetchedAt: now,
    };

    return ref;
  } catch (error) {
    console.warn("Failed to resolve latest commit SHA, fallback to branch ref", error);
    return GITHUB_BRANCH;
  }
};

const getFolderPath = (folderName: string) => `${GITHUB_BASE_PATH}/${folderName}`;

const getMarkdownFilesFromGitHubApi = async (folderName: string): Promise<GitHubContentFileEntry[]> => {
  const folderPath = getFolderPath(folderName);
  const url = buildContentsApiUrl(folderPath);
  const entries = await fetchJson<GitHubContentFileEntry[]>(url);

  return entries.filter((entry) => entry.type === "file" && entry.name.endsWith(".md")).sort((a, b) => a.name.localeCompare(b.name));
};

const getMarkdownFilesFromJsDelivr = async (folderName: string): Promise<GitHubContentFileEntry[]> => {
  const folderPath = getFolderPath(folderName).replace(/^\/+|\/+$/g, "");
  const folderPrefix = `/${folderPath}/`;
  const latestRef = await getLatestContentRef();
  const response = await fetchJson<JsDelivrFlatResponse>(buildJsDelivrFlatApiUrl(latestRef));

  return response.files
    .filter((entry) => entry.name.startsWith(folderPrefix) && entry.name.endsWith(".md"))
    .map((entry) => {
      const normalizedPath = entry.name.replace(/^\/+/, "");
      const fileName = normalizedPath.split("/").pop() ?? normalizedPath;

      return {
        name: fileName,
        path: normalizedPath,
        sha: entry.hash,
        size: entry.size,
        download_url: buildRawUrl(normalizedPath, latestRef),
        type: "file",
      } satisfies GitHubContentFileEntry;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

const getMarkdownFiles = async (folderName: string): Promise<GitHubContentFileEntry[]> => {
  try {
    return await getMarkdownFilesFromJsDelivr(folderName);
  } catch (error) {
    console.warn("Failed to fetch content list from jsDelivr, fallback to GitHub API", error);
    return getMarkdownFilesFromGitHubApi(folderName);
  }
};

const normalizeDetailPath = (folderName: string, fileNameOrPath: string) => {
  if (fileNameOrPath.includes("/")) {
    return fileNameOrPath;
  }

  return `${getFolderPath(folderName)}/${fileNameOrPath}`;
};

const getDetailByRawPath = async <T>(path: string): Promise<T> => {
  const latestRef = await getLatestContentRef();

  try {
    const rawUrl = buildRawUrl(path, latestRef);
    const rawText = await fetchText(rawUrl);

    return parseJsonContent<T>(rawText, path);
  } catch (error) {
    console.warn("Failed to fetch detail from jsDelivr, fallback to GitHub raw", error);

    try {
      const rawText = await fetchText(buildGitHubRawUrl(path, latestRef));
      return parseJsonContent<T>(rawText, path);
    } catch (rawError) {
      console.warn("Failed to fetch detail from GitHub raw, fallback to GitHub Contents API", rawError);

      const fileResponse = await fetchJson<GitHubContentFileResponse>(buildContentsApiUrl(path));

      if (fileResponse.type !== "file" || fileResponse.encoding !== "base64" || !fileResponse.content) {
        throw new Error(`Invalid GitHub Contents API response for ${path}`);
      }

      const rawText = decodeBase64Utf8(fileResponse.content);
      return parseJsonContent<T>(rawText, path);
    }
  }
};

const mapCmsProductToProduct = (content: CmsProductContent): ProductContent => {
  return {
    id: content.prd_id,
    name: content.prd_nama,
    specification: content.prd_spesifikasi,
    usagePerSquareMeter: content.prd_kebutuhan_m2,
    wholesalePrice: content.prd_harga_grosir,
    retailPrice: content.prd_harga_eceran,
    images: content.prd_image,
  };
};

const mapCmsProductionHouseToProductionHouse = (content: CmsProductionHouseContent): ProductionHouseContent => {
  return {
    id: content.rmp_id,
    name: content.rmp_nama,
    address: content.rmp_alamat,
    moldingCapacity: content.rmp_kapasitas_cetak,
    furnaceCapacity: content.rmp_kapasitas_tungku,
    workersInfo: content.rmp_pekerja,
    dormantStock: content.rmp_stok_dormant,
    photos: content.rmp_foto,
  };
};

export const getProductFileList = async (): Promise<GitHubContentFileEntry[]> => {
  return getMarkdownFiles(PRODUCT_FOLDER);
};

export const getProductionHouseFileList = async (): Promise<GitHubContentFileEntry[]> => {
  return getMarkdownFiles(PRODUCTION_HOUSE_FOLDER);
};

export const getProductDetail = async (fileNameOrPath: string): Promise<ProductContent> => {
  const detailPath = normalizeDetailPath(PRODUCT_FOLDER, fileNameOrPath);
  const rawContent = await getDetailByRawPath<CmsProductContent>(detailPath);
  return mapCmsProductToProduct(rawContent);
};

export const getProductionHouseDetail = async (fileNameOrPath: string): Promise<ProductionHouseContent> => {
  const detailPath = normalizeDetailPath(PRODUCTION_HOUSE_FOLDER, fileNameOrPath);
  const rawContent = await getDetailByRawPath<CmsProductionHouseContent>(detailPath);
  return mapCmsProductionHouseToProductionHouse(rawContent);
};

export const getProductList = async (): Promise<ProductContent[]> => {
  const files = await getProductFileList();
  const details = await Promise.all(files.map((file) => getProductDetail(file.path)));
  return details;
};

export const getProductionHouseList = async (): Promise<ProductionHouseContent[]> => {
  const files = await getProductionHouseFileList();
  const details = await Promise.all(files.map((file) => getProductionHouseDetail(file.path)));
  return details;
};
