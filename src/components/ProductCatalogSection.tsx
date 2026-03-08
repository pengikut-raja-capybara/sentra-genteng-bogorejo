import type { Product } from '../types/landing'

type ProductCatalogSectionProps = {
  products: Product[]
}

export function ProductCatalogSection({ products }: ProductCatalogSectionProps) {
  return (
    <section
      id="katalog"
      className="rounded-3xl border border-[#dccdb8] bg-[#fffdf8] p-6 shadow-[0_0.875em_2.5em_rgba(52,33,13,0.16)] md:p-8"
    >
      <h2 className="font-['Bitter'] text-[clamp(1.4rem,2.4vw,2rem)] leading-tight">
        Katalog Produk Kami
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.name} className="rounded-2xl border border-[#dccdb8] bg-white p-4">
            <div className="h-32 rounded-xl bg-[linear-gradient(145deg,rgba(214,106,31,0.42),rgba(166,70,11,0.22)),repeating-linear-gradient(-35deg,rgba(47,42,38,0.34),rgba(47,42,38,0.34)_0.5em,rgba(239,228,211,0.88)_0.5em,rgba(239,228,211,0.88)_0.9375em)]" />
            <h3 className="mt-3 font-['Bitter'] text-lg leading-tight">{product.name}</h3>
            <p className="mt-2 text-sm text-[#4d443d]">{product.spec}</p>
            <p className="mt-1 text-sm text-[#4d443d]">{product.usage}</p>
            <p className="mt-3 inline-flex rounded-full bg-[#a9460b] [padding:0.25em_0.75em] text-xs font-semibold text-white">
              {product.note}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}