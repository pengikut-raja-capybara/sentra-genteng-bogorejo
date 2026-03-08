import type { ValuePropositionItem } from '../types/landing'

type ValuePropositionSectionProps = {
  items: ValuePropositionItem[]
}

export function ValuePropositionSection({ items }: ValuePropositionSectionProps) {
  return (
    <section className="rounded-3xl border border-[#dccdb8] bg-[#fffdf8] p-6 shadow-[0_0.875em_2.5em_rgba(52,33,13,0.16)] md:p-8">
      <h2 className="font-['Bitter'] text-[clamp(1.4rem,2.4vw,2rem)] leading-tight">
        Mengapa Memilih Kami?
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className="rounded-2xl border border-dashed border-[#dccdb8] bg-white p-4">
            <h3 className="font-['Bitter'] text-lg leading-tight">{item.title}</h3>
            <p className="mt-2 text-sm text-[#4d443d]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}