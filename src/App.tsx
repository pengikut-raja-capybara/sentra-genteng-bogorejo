import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { CapacitySection } from './components/CapacitySection'
import { ProductionHouseSection } from './components/ProductionHouseSection'
import { ProductCatalogSection } from './components/ProductCatalogSection'
import { ValuePropositionSection } from './components/ValuePropositionSection'
import { LeadCaptureSection } from './components/LeadCaptureSection'
import { FooterSection } from './components/FooterSection'
import {
  getProductList,
  getProductionHouseList,
} from './utils/contentApi'
import type { CapacityMetric } from './types/landing'
import type { ProductContent, ProductionHouseContent } from './types/content'
import {
  navItems,
  heroContent,
  capacityMetrics as fallbackCapacityMetrics,
  capacityDescription,
  products as fallbackProducts,
  valuePropositions,
  contactInfo,
  contactDescription,
  footerText,
  footerKeywords,
  footerCreditPrefix,
  footerCreditLabel,
  footerCreators,
} from './data/landingData'

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim()

const mapFallbackProductToProductContent = (
  item: (typeof fallbackProducts)[number],
  index: number,
): ProductContent => {
  const spec = normalizeText(item.spec)
  const usage = normalizeText(item.usage).replace(/^Kebutuhan:\s*/i, '')

  return {
    id: `fallback-${index + 1}`,
    name: normalizeText(item.name),
    specification: spec,
    usagePerSquareMeter: usage,
    wholesalePrice: '-',
    retailPrice: '-',
    images: [],
  }
}

const mapCapacityWithProductionHouseCount = (
  baseMetrics: CapacityMetric[],
  productionHouseCount: number,
): CapacityMetric[] => {
  return baseMetrics.map((metric, index) => {
    if (index !== 0) {
      return metric
    }

    return {
      ...metric,
      value: `${productionHouseCount}+`,
      detail: `${productionHouseCount} rumah produksi aktif terdeteksi dari CMS`,
    }
  })
}

function App() {
  const [products, setProducts] = useState<ProductContent[]>(
    fallbackProducts.map(mapFallbackProductToProductContent),
  )
  const [capacityMetrics, setCapacityMetrics] =
    useState<CapacityMetric[]>(fallbackCapacityMetrics)
  const [productionHouses, setProductionHouses] = useState<ProductionHouseContent[]>([])

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      try {
        const [productList, productionHouseList] = await Promise.all([
          getProductList(),
          getProductionHouseList(),
        ])

        if (!active) {
          return
        }

        if (productList.length > 0) {
          setProducts(productList)
        }

        if (productionHouseList.length > 0) {
          setProductionHouses(productionHouseList)
          setCapacityMetrics(
            mapCapacityWithProductionHouseCount(
              fallbackCapacityMetrics,
              productionHouseList.length,
            ),
          )
        }
      } catch (error) {
        console.error('Failed to load content from GitHub CMS, using local fallback.', error)
      }
    }

    void loadContent()

    return () => {
      active = false
    }
  }, [])

  return (
    <div id="beranda" className="mx-auto w-[94vw] max-w-[70em] pb-10 pt-5">
      <Header brand="SENTRA GENTENG BOGOREJO" navItems={navItems} />

      <main className="mt-5 space-y-5">
        <HeroSection content={heroContent} contactInfo={contactInfo} />
        <CapacitySection
          metrics={capacityMetrics}
          description={capacityDescription}
        />
        <ProductionHouseSection productionHouses={productionHouses} />
        <ProductCatalogSection
          products={products}
          whatsappLink={contactInfo.whatsappLink}
        />
        <ValuePropositionSection items={valuePropositions} />
        <LeadCaptureSection
          contactInfo={contactInfo}
          description={contactDescription}
        />
      </main>

      <FooterSection
        text={footerText}
        keywords={footerKeywords}
        creditPrefix={footerCreditPrefix}
        creditLabel={footerCreditLabel}
        creators={footerCreators}
      />
    </div>
  )
}

export default App
