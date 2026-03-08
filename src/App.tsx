import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { CapacitySection } from './components/CapacitySection'
import { ProductCatalogSection } from './components/ProductCatalogSection'
import { ValuePropositionSection } from './components/ValuePropositionSection'
import { LeadCaptureSection } from './components/LeadCaptureSection'
import { FooterSection } from './components/FooterSection'
import {
  navItems,
  heroContent,
  capacityMetrics,
  capacityDescription,
  products,
  valuePropositions,
  contactInfo,
  contactDescription,
  footerText,
  footerKeywords,
} from './data/landingData'

function App() {
  return (
    <div id="beranda" className="mx-auto w-[94vw] max-w-[70em] pb-10 pt-5">
      <Header brand="SENTRA GENTENG BOGOREJO" navItems={navItems} />

      <main className="mt-5 space-y-5">
        <HeroSection content={heroContent} contactInfo={contactInfo} />
        <CapacitySection
          metrics={capacityMetrics}
          description={capacityDescription}
        />
        <ProductCatalogSection products={products} />
        <ValuePropositionSection items={valuePropositions} />
        <LeadCaptureSection
          contactInfo={contactInfo}
          description={contactDescription}
        />
      </main>

      <FooterSection text={footerText} keywords={footerKeywords} />
    </div>
  )
}

export default App
