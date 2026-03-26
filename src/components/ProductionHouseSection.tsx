import { useEffect, useMemo, useState } from 'react'
import type { ProductionHouseContent } from '../types/content'
import { ContentDetailModal } from './ContentDetailModal'
import { CdnImage } from './CdnImage'

type ProductionHouseSectionProps = {
  productionHouses: ProductionHouseContent[]
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

const getProductionHousePhotoUrls = (item: ProductionHouseContent) => {
  return item.photos.filter((path) => path.trim().length > 0)
}

const ProductionHouseSkeletonCard = ({ index }: { index: number }) => {
  return (
    <article
      className="w-full max-w-[32em] overflow-hidden rounded-2xl border border-[#dccdb8] bg-white shadow-[0_0.5em_1.25em_rgba(52,33,13,0.08)] md:w-[calc(50%-0.7em)]"
      aria-hidden="true"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="h-48 w-full animate-pulse bg-[#f2e6d5]" />
      <div className="space-y-2 p-4">
        <div className="h-6 w-2/3 animate-pulse rounded bg-[#efe2d0]" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-[#f3e9db]" />
        <div className="h-16 w-full animate-pulse rounded-lg bg-[#efe2d0]" />
      </div>
    </article>
  )
}

export function ProductionHouseSection({
  productionHouses,
  isLoading = false,
}: ProductionHouseSectionProps) {
  const [activeProductionHouseId, setActiveProductionHouseId] = useState<string | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [shuffledProductionHouses, setShuffledProductionHouses] = useState<
    ProductionHouseContent[]
  >(() => shuffleItems(productionHouses))

  useEffect(() => {
    setShuffledProductionHouses(shuffleItems(productionHouses))
  }, [productionHouses])

  useEffect(() => {
    if (productionHouses.length <= 1) {
      return
    }

    const intervalId = window.setInterval(() => {
      setShuffledProductionHouses((currentHouses) => shuffleItems(currentHouses))
    }, 12000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [productionHouses])

  const activeProductionHouse = useMemo(() => {
    if (!activeProductionHouseId) {
      return null
    }

    return productionHouses.find((item) => item.id === activeProductionHouseId) ?? null
  }, [activeProductionHouseId, productionHouses])

  const activeProductionHouseImages = useMemo(() => {
    if (!activeProductionHouse) {
      return []
    }

    return getProductionHousePhotoUrls(activeProductionHouse)
  }, [activeProductionHouse])

  const activeImageUrl = selectedImageUrl ?? activeProductionHouseImages[0] ?? null

  const openDetail = (productionHouseId: string) => {
    setSelectedImageUrl(null)
    setActiveProductionHouseId(productionHouseId)
  }

  const closeDetail = () => {
    setActiveProductionHouseId(null)
    setSelectedImageUrl(null)
  }

  return (
    <>
      <section
        id="rumah-produksi"
        className="rounded-3xl border border-[#dccdb8] bg-[#fffdf8] p-6 shadow-[0_0.875em_2.5em_rgba(52,33,13,0.16)] md:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="inline-flex rounded-full border border-[#d9c5a6] bg-[#fff5e7] [padding:0.25em_0.75em] text-xs font-semibold uppercase tracking-[0.08em] text-[#7a3a10]">
              Jaringan Produksi
            </p>
            <h2 className="mt-2 font-['Bitter'] text-[clamp(1.4rem,2.4vw,2rem)] leading-tight">
              Mitra Produksi Kami
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#6b5f55]">
            {isLoading ? 'Memuat data mitra produksi...' : `${productionHouses.length} mitra aktif`}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-5">
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <ProductionHouseSkeletonCard key={`production-house-skeleton-${index}`} index={index} />
              ))
            : shuffledProductionHouses.map((item) => (
            <article
              key={item.id}
              className="group w-full max-w-[32em] overflow-hidden rounded-2xl border border-[#dccdb8] bg-white shadow-[0_0.5em_1.25em_rgba(52,33,13,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_1em_2em_rgba(52,33,13,0.15)] md:w-[calc(50%-0.7em)]"
            >
              <div className="relative overflow-hidden">
                {item.photos[0] ? (
                  <CdnImage
                    src={item.photos[0]}
                    alt={normalizeText(item.name)}
                    loading="lazy"
                    className="block h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-48 bg-[linear-gradient(145deg,rgba(214,106,31,0.42),rgba(166,70,11,0.22)),repeating-linear-gradient(-35deg,rgba(47,42,38,0.34),rgba(47,42,38,0.34)_0.5em,rgba(239,228,211,0.88)_0.5em,rgba(239,228,211,0.88)_0.9375em)]" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(26,17,9,0.56)_100%)]" />
                <p className="absolute bottom-3 left-3 rounded-full bg-[#fff3e1]/95 [padding:0.2em_0.7em] text-xs font-bold uppercase tracking-[0.08em] text-[#7d3c12]">
                  Mitra Produksi
                </p>
              </div>

              <div className="space-y-2 p-4">
                <h3 className="font-['Bitter'] text-xl leading-tight text-[#241c16]">
                  {normalizeText(item.name)}
                </h3>
                <p className="text-sm text-[#5f5145]">{normalizeText(item.address)}</p>
                <div className="grid gap-2 text-sm text-[#4d443d] sm:grid-cols-2">
                  <p className="rounded-lg border border-[#ead6bb] bg-[#fff8eb] [padding:0.45em_0.7em]">
                    <div className="font-semibold text-[#7f451f]">Kapasitas Cetak:</div>
                    {normalizeText(item.moldingCapacity)}
                  </p>
                  <p className="rounded-lg border border-[#ead6bb] bg-[#fff8eb] [padding:0.45em_0.7em]">
                    <div className="font-semibold text-[#7f451f]">Kapasitas Tungku:</div>
                    {normalizeText(item.furnaceCapacity)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openDetail(item.id)}
                  className="rounded-full border border-[#d7b48f] bg-[#fff4e2] [padding:0.35em_0.9em] text-xs font-semibold text-[#7a3a10] transition hover:bg-[#ffe8c9]"
                >
                  Lihat Detail
                </button>
              </div>
            </article>
          ))}

          {!isLoading && shuffledProductionHouses.length === 0 ? (
            <p className="w-full rounded-2xl border border-[#e6d4bf] bg-[#fff8ed] p-4 text-center text-sm text-[#6b5f55]">
              Data mitra produksi belum tersedia.
            </p>
          ) : null}
        </div>
      </section>

      <ContentDetailModal
        isOpen={Boolean(activeProductionHouse)}
        onClose={closeDetail}
        titleId="rumah-produksi-detail-title"
        maxWidthClass="max-w-[54em]"
        heightClass="h-[88vh]"
        layoutClassName="lg:grid-cols-[1fr_1.12fr]"
        leftPanel={
          <div className="relative h-full bg-[#2c1b12]">
            {activeImageUrl ? (
              <CdnImage
                src={activeImageUrl}
                alt={normalizeText(activeProductionHouse?.name ?? '')}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(145deg,rgba(214,106,31,0.42),rgba(166,70,11,0.22)),repeating-linear-gradient(-35deg,rgba(47,42,38,0.34),rgba(47,42,38,0.34)_0.5em,rgba(239,228,211,0.88)_0.5em,rgba(239,228,211,0.88)_0.9375em)]" />
            )}

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(12,7,4,0.58)_100%)]" />

            {activeProductionHouseImages.length > 1 ? (
              <div className="absolute inset-x-3 bottom-3 grid grid-cols-4 gap-2 rounded-lg bg-[#2b1b12]/70 p-2 backdrop-blur-sm">
                {activeProductionHouseImages.map((imageUrl) => (
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
                      alt={`Foto ${normalizeText(activeProductionHouse?.name ?? '')}`}
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
                  Detail Rumah Produksi
                </p>
                <h3
                  id="rumah-produksi-detail-title"
                  className="mt-1 font-['Bitter'] text-2xl leading-tight"
                >
                  {normalizeText(activeProductionHouse?.name ?? '')}
                </h3>
                <p className="mt-1 text-sm text-[#66584b]">{normalizeText(activeProductionHouse?.address ?? '')}</p>
              </div>
              <button
                type="button"
                onClick={closeDetail}
                className="rounded-full border border-[#d9c5a6] [padding:0.15em_0.55em] text-lg leading-none text-[#6b5f55] transition hover:bg-[#fff1df]"
                aria-label="Tutup detail rumah produksi"
              >
                ×
              </button>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <p className="rounded-lg border border-[#ead6bb] bg-[#fff8eb] [padding:0.45em_0.7em] text-[#5f5145]">
                <span className="mr-2 font-semibold text-[#7f451f]">Kapasitas Cetak</span>
                {normalizeText(activeProductionHouse?.moldingCapacity ?? '')}
              </p>
              <p className="rounded-lg border border-[#ead6bb] bg-[#fff8eb] [padding:0.45em_0.7em] text-[#5f5145]">
                <span className="mr-2 font-semibold text-[#7f451f]">Kapasitas Tungku</span>
                {normalizeText(activeProductionHouse?.furnaceCapacity ?? '')}
              </p>
              <p className="rounded-lg border border-[#ead6bb] bg-[#fff8eb] [padding:0.45em_0.7em] text-[#5f5145]">
                <span className="mr-2 font-semibold text-[#7f451f]">Stok Dormant</span>
                {normalizeText(activeProductionHouse?.dormantStock ?? '')}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-[#eadcc7] bg-[#fffcf7] p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.09em] text-[#8a4f26]">
                Informasi Tenaga Kerja
              </p>
              <p className="whitespace-pre-line text-sm leading-5 text-[#3f352d]">
                {normalizeText(activeProductionHouse?.workersInfo ?? '')}
              </p>
            </div>
          </div>
        }
      />
    </>
  )
}
