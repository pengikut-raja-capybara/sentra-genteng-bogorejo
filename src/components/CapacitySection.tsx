import type { CapacityMetric } from '../types/landing'

type CapacitySectionProps = {
  metrics: CapacityMetric[]
  description: string
}

export function CapacitySection({ metrics, description }: CapacitySectionProps) {
  return (
    <section
      id="kapasitas"
      className="rounded-3xl border border-[#dccdb8] bg-[#fffdf8] p-6 shadow-[0_0.875em_2.5em_rgba(52,33,13,0.16)] md:p-8"
    >
      <h2 className="font-['Bitter'] text-[clamp(1.4rem,2.4vw,2rem)] leading-tight">
        Kapasitas Skala Pabrik, Kualitas Terjaga
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-[#dccdb8] bg-[linear-gradient(180deg,#fffefb,#fff9f1)] p-4"
          >
            <div className="grid h-12 w-12 place-items-center rounded-[0.875em] bg-[linear-gradient(145deg,#a9460b,#d66a1f)] text-sm font-bold text-white">
              {metric.symbol}
            </div>
            <p className="mt-3 font-['Bitter'] text-2xl leading-tight">{metric.value}</p>
            <h3 className="mt-1 font-['Bitter'] text-base leading-tight">{metric.label}</h3>
            <p className="mt-2 text-sm text-[#4d443d]">{metric.detail}</p>
          </article>
        ))}
      </div>

      <p className="mt-4 text-sm text-[#4d443d]">{description}</p>
    </section>
  )
}