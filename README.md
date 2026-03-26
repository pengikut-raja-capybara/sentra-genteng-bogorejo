# Sentra Genteng Bogorejo

Landing page profil dan katalog Sentra Genteng Bogorejo berbasis React + Vite dengan integrasi konten dari GitHub CMS.

## Tujuan Proyek

- Menampilkan profil sentra produksi genteng secara profesional.
- Menyediakan katalog produk yang mudah diakses calon pembeli.
- Mengelola konten produk dan rumah produksi dari repository konten (tanpa ubah kode aplikasi setiap kali update data).

## Fitur Utama

- Hero, value proposition, dan lead capture section.
- Showcase Produk dan Rumah Produksi dengan urutan acak serta auto-rotate.
- Modal detail konten (foto, spesifikasi, kapasitas, informasi tenaga kerja).
- Perhitungan kapasitas cetak bulanan otomatis dari data rumah produksi CMS.
- Sumber konten utama via jsDelivr (menggunakan ref commit terbaru) dengan fallback berlapis ke GitHub API.
- Optimasi URL gambar via CDN proxy (`weserv` / `statically`) dan fallback render saat CDN image gagal.
- Optimasi build (image optimizer + kompresi aset) untuk performa deploy.

## Tech Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- GitHub Pages (deployment via GitHub Actions)

## Struktur Data CMS (Ringkas)

Sumber konten dibaca dari branch/folder repository konten yang dikonfigurasi lewat environment variable:

- Folder produk: `content/produk`
- Folder rumah produksi: `content/rumah_produksi`

Setiap file konten diparsing oleh utilitas di `src/utils/contentApi.ts` lalu dimapping ke model internal TypeScript di `src/types/content.ts`.

Urutan pengambilan konten:

1. jsDelivr (`data.jsdelivr.com` + `cdn.jsdelivr.net`) dengan ref commit terbaru branch.
2. GitHub Raw (`raw.githubusercontent.com`).
3. GitHub Contents API (`api.github.com`) sebagai fallback terakhir untuk detail file.

## Environment Setup

### Local Development

1. Copy file `.env.example` menjadi `.env`
2. Isi value sesuai kebutuhan:

```env
VITE_CONTENT_GITHUB_OWNER=pengikut-raja-capybara
VITE_CONTENT_GITHUB_REPO=sentra-genteng-bogorejo
VITE_CONTENT_GITHUB_BRANCH=content
VITE_CONTENT_BASE_PATH=content

VITE_CONTENT_IMAGE_PROXY=weserv
VITE_CONTENT_IMAGE_QUALITY=75
VITE_CONTENT_IMAGE_WIDTH=0

VITE_SIMULATE_ALL_CDN_DOWN=false
```

Keterangan env tambahan:

- `VITE_CONTENT_IMAGE_PROXY`: `weserv` | `statically` | `none`.
- `VITE_CONTENT_IMAGE_QUALITY`: kualitas kompresi gambar (default `75`).
- `VITE_CONTENT_IMAGE_WIDTH`: resize lebar gambar (0 = nonaktif).
- `VITE_SIMULATE_ALL_CDN_DOWN`: mode uji outage CDN saat development (`true`/`false`).

## Menjalankan Proyek

Install dependency:

```bash
bun install
```

Jalankan mode development:

```bash
bun run dev
```

Build production:

```bash
bun run build
```

Preview hasil build:

```bash
bun run preview
```

## Deployment

Deploy menggunakan GitHub Actions workflow di `.github/workflows/deploy.yml`.

Workflow akan:

1. Install dependency via Bun
2. Build aplikasi
3. Publish folder `dist` ke branch `gh-pages`

### GitHub Repository Variables

Tambahkan variable berikut di repository (Settings > Secrets and variables > Actions > Variables):

- `VITE_CONTENT_GITHUB_OWNER`
- `VITE_CONTENT_GITHUB_REPO`
- `VITE_CONTENT_GITHUB_BRANCH`
- `VITE_CONTENT_BASE_PATH`
- `VITE_CONTENT_IMAGE_PROXY`
- `VITE_CONTENT_IMAGE_QUALITY`
- `VITE_CONTENT_IMAGE_WIDTH`
- `VITE_SIMULATE_ALL_CDN_DOWN`

Jika belum diisi, workflow menggunakan default yang sama seperti `.env.example`.

## Catatan

- File `.env` sudah di-ignore oleh Git.
- Jika jsDelivr atau GitHub Raw tidak tersedia, pembacaan detail konten akan fallback ke GitHub Contents API.
- Untuk uji skenario outage CDN, set `VITE_SIMULATE_ALL_CDN_DOWN=true` lalu restart dev server.
