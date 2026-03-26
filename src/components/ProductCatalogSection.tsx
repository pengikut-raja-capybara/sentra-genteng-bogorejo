import { useEffect, useMemo, useState } from 'react'
import type { ProductContent } from '../types/content'
import { ContentDetailModal } from './ContentDetailModal'
import { CdnImage } from './CdnImage'

type ProductCatalogSectionProps = {
  products: ProductContent[]
  whatsappLink: string
  isLoading?: boolean
}

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim()

const shuffleItems = <T,>(items: T[]): T[] => {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }

  return result
}

const formatProductUsage = (usagePerSquareMeter: string) => {
  return `Kebutuhan: ${normalizeText(usagePerSquareMeter)} pcs/m2`
}

const formatProductPrice = (wholesalePrice: string, retailPrice: string) => {
  return `Grosir ${normalizeText(wholesalePrice)} | Eceran ${normalizeText(retailPrice)}`
}

const getProductImageUrls = (product: ProductContent) => {
  return product.images.filter((path) => path.trim().length > 0)
}

const formatDetailSpec = (spec: string) => {
  return spec
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const buildWhatsAppSummary = (product: ProductContent) => {
  return [
    `Halo, saya ingin tanya lebih lanjut tentang ${normalizeText(product.name)}.`,
    '',
    `Kebutuhan saya sekitar ${normalizeText(product.usagePerSquareMeter)} pcs/m2.`,
    `Harga grosir saat ini: ${normalizeText(product.wholesalePrice)}.`,
    `Harga eceran saat ini: ${normalizeText(product.retailPrice)}.`,
    '',
    'Bisa dibantu info:',
    '- Ketersediaan stok terbaru',
    '- Estimasi pengiriman ke lokasi saya',
    '- Minimal order dan opsi pembayaran',
  ].join('\n')
}

const ProductCatalogSkeletonCard = ({ index }: { index: number }) => {
  return (
    <article
      className="w-full max-w-[22.5em] overflow-hidden rounded-2xl border border-[#dccdb8] bg-white shadow-[0_0.5em_1.25em_rgba(52,33,13,0.08)] sm:w-[calc(50%-0.7em)] lg:w-[calc(33.333%-0.9em)]"
      aria-hidden="true"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="h-40 w-full animate-pulse bg-[#f2e6d5]" />
      <div className="space-y-3 p-4">
        <div className="h-6 w-2/3 animate-pulse rounded bg-[#efe2d0]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#f3e9db]" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-[#f3e9db]" />
        <div className="h-4 w-10/12 animate-pulse rounded bg-[#f3e9db]" />
        <div className="h-8 w-full animate-pulse rounded-lg bg-[#efe2d0]" />
      </div>
    </article>
  )
}

export function ProductCatalogSection({
  products,
  whatsappLink,
  isLoading = false,
}: ProductCatalogSectionProps) {
  const [activeProductId, setActiveProductId] = useState<string | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [shuffledProducts, setShuffledProducts] = useState<ProductContent[]>(() =>
    shuffleItems(products),
  )

  useEffect(() => {
    setShuffledProducts(shuffleItems(products))
  }, [products])

  useEffect(() => {
    if (products.length <= 1) {
      return
    }

    const intervalId = window.setInterval(() => {
      setShuffledProducts((currentProducts) => shuffleItems(currentProducts))
    }, 12000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [products])

  const activeProduct = useMemo(() => {
    if (!activeProductId) {
      return null
    }

    return products.find((product) => product.id === activeProductId) ?? null
  }, [activeProductId, products])

  const activeProductImages = useMemo(() => {
    if (!activeProduct) {
      return []
    }

    return getProductImageUrls(activeProduct)
  }, [activeProduct])

  const activeImageUrl = selectedImageUrl ?? activeProductImages[0] ?? null

  const openProductDetail = (productId: string) => {
    setSelectedImageUrl(null)
    setActiveProductId(productId)
  }

  const closeProductDetail = () => {
    setActiveProductId(null)
    setSelectedImageUrl(null)
  }

  const buildWhatsAppUrl = () => {
    if (!activeProduct) {
      return whatsappLink
    }

    const baseUrl = whatsappLink.split('?')[0]
    const encodedText = encodeURIComponent(buildWhatsAppSummary(activeProduct))
    return `${baseUrl}?text=${encodedText}`
  }

  return (
    <>
      <section
        id="katalog"
        className="rounded-3xl border border-[#dccdb8] bg-[linear-gradient(180deg,#fffdf8,#fff8ee)] p-6 shadow-[0_0.875em_2.5em_rgba(52,33,13,0.16)] md:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="inline-flex rounded-full border border-[#d9c5a6] bg-[#fff5e7] [padding:0.25em_0.75em] text-xs font-semibold uppercase tracking-[0.08em] text-[#7a3a10]">
              Koleksi Genteng
            </p>
            <h2 className="mt-2 font-['Bitter'] text-[clamp(1.4rem,2.4vw,2rem)] leading-tight">
              Katalog Produk Kami
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#6b5f55]">
            {isLoading ? 'Memuat katalog produk...' : `${products.length} produk aktif`}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <ProductCatalogSkeletonCard key={`product-skeleton-${index}`} index={index} />
              ))
            : shuffledProducts.map((product) => (
            <article
              key={product.id}
              className="group w-full max-w-[22.5em] overflow-hidden rounded-2xl border border-[#dccdb8] bg-white shadow-[0_0.5em_1.25em_rgba(52,33,13,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_1em_2em_rgba(52,33,13,0.15)] sm:w-[calc(50%-0.7em)] lg:w-[calc(33.333%-0.9em)]"
            >
              <div className="relative overflow-hidden">
                {product.images[0] ? (
                  <CdnImage
                    src={product.images[0]}
                    alt={normalizeText(product.name)}
                    loading="lazy"
                    className="block h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-40 bg-[linear-gradient(145deg,rgba(214,106,31,0.42),rgba(166,70,11,0.22)),repeating-linear-gradient(-35deg,rgba(47,42,38,0.34),rgba(47,42,38,0.34)_0.5em,rgba(239,228,211,0.88)_0.5em,rgba(239,228,211,0.88)_0.9375em)]" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(26,17,9,0.52)_100%)]" />
                <p className="absolute bottom-3 left-3 rounded-full bg-[#fff3e1]/95 [padding:0.2em_0.7em] text-xs font-bold uppercase tracking-[0.08em] text-[#7d3c12]">
                  Produk Pilihan
                </p>
              </div>

              <div className="space-y-3 p-4">
                <h3 className="font-['Bitter'] text-[1.45rem] leading-tight text-[#241c16]">
                  {normalizeText(product.name)}
                </h3>
                <p className="text-sm leading-7 text-[#4d443d] [display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
                  {normalizeText(product.specification)}
                </p>
                <div className="rounded-lg border border-[#ecdcc5] bg-[#fffcf7] [padding:0.5em_0.75em] text-sm font-medium text-[#5c4f43]">
                  {formatProductUsage(product.usagePerSquareMeter)}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="inline-flex w-full rounded-lg bg-[#a9460b] [padding:0.35em_0.85em] text-xs font-semibold text-white">
                    {formatProductPrice(product.wholesalePrice, product.retailPrice)}
                  </p>
                  <button
                    type="button"
                    onClick={() => openProductDetail(product.id)}
                    className="rounded-full border border-[#d7b48f] bg-[#fff4e2] [padding:0.35em_0.85em] text-xs font-semibold text-[#7a3a10] transition hover:bg-[#ffe8c9]"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </article>
          ))}

          {!isLoading && shuffledProducts.length === 0 ? (
            <p className="w-full rounded-2xl border border-[#e6d4bf] bg-[#fff8ed] p-4 text-center text-sm text-[#6b5f55]">
              Data produk belum tersedia.
            </p>
          ) : null}
        </div>
      </section>

      <ContentDetailModal
        isOpen={Boolean(activeProduct)}
        onClose={closeProductDetail}
        titleId="product-detail-title"
        heightClass="h-[88vh]"
        leftPanel={
          <div className="relative h-full bg-[#2c1b12]">
            {activeImageUrl ? (
              <CdnImage
                src={activeImageUrl}
                alt={normalizeText(activeProduct?.name ?? '')}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(145deg,rgba(214,106,31,0.42),rgba(166,70,11,0.22)),repeating-linear-gradient(-35deg,rgba(47,42,38,0.34),rgba(47,42,38,0.34)_0.5em,rgba(239,228,211,0.88)_0.5em,rgba(239,228,211,0.88)_0.9375em)]" />
            )}

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(12,7,4,0.58)_100%)]" />

            {activeProductImages.length > 1 ? (
              <div className="absolute inset-x-3 bottom-3 grid grid-cols-4 gap-2 rounded-lg bg-[#2b1b12]/70 p-2 backdrop-blur-sm">
                {activeProductImages.map((imageUrl) => (
                  <button
                    key={imageUrl}
                    type="button"
                    onClick={() => setSelectedImageUrl(imageUrl)}
                    className={`overflow-hidden rounded-lg border transition ${
                      activeImageUrl === imageUrl
                        ? 'border-[#a9460b] ring-2 ring-[#a9460b]/30'
                        : 'border-[#d9c5a6] hover:border-[#c89e76]'
                    }`}
                  >
                    <CdnImage
                      src={imageUrl}
                      alt={`Gambar ${normalizeText(activeProduct?.name ?? '')}`}
                      className="h-14 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        }
        rightPanel={
          <div className="flex h-full flex-col overflow-y-auto p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8a4f26]">
                  Ringkasan Produk
                </p>
                <h3 id="product-detail-title" className="mt-1 font-['Bitter'] text-2xl leading-tight">
                  {normalizeText(activeProduct?.name ?? '')}
                </h3>
                <p className="mt-1 text-sm text-[#66584b]">
                  Cocok untuk kebutuhan proyek rumah tinggal hingga bangunan skala besar.
                </p>
              </div>
              <button
                type="button"
                onClick={closeProductDetail}
                className="rounded-full border border-[#d9c5a6] [padding:0.15em_0.55em] text-lg leading-none text-[#6b5f55] transition hover:bg-[#fff1df]"
                aria-label="Tutup detail produk"
              >
                ×
              </button>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <p className="rounded-lg border border-[#ead6bb] bg-[#fff8eb] [padding:0.45em_0.7em] text-[#5f5145]">
                <span className="mr-2 font-semibold text-[#7f451f]">Kebutuhan</span>
                {normalizeText(activeProduct?.usagePerSquareMeter ?? '')} pcs/m2
              </p>
              <p className="rounded-lg border border-[#ead6bb] bg-[#fff8eb] [padding:0.45em_0.7em] text-[#5f5145]">
                <span className="mr-2 font-semibold text-[#7f451f]">Harga</span>
                Grosir {normalizeText(activeProduct?.wholesalePrice ?? '')} | Eceran{' '}
                {normalizeText(activeProduct?.retailPrice ?? '')}
              </p>
            </div>

            <div className="mt-3 flex justify-start">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#128c7e] [padding:0.4em_0.95em] text-xs font-semibold text-white transition hover:bg-[#0f7a6f]"
                >
                  Tanya via WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto rounded-xl border border-[#eadcc7] bg-[#fffcf7] p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.09em] text-[#8a4f26]">
                Uraian Produk
              </p>
              <p className="whitespace-pre-line text-sm leading-5 text-[#3f352d]">
                {formatDetailSpec(activeProduct?.specification ?? '')}
              </p>
            </div>
          </div>
        }
      />
    </>
  )
}