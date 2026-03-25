import type { ContactInfo, HeroContent } from '../types/landing'

type HeroSectionProps = {
  content: HeroContent
  contactInfo: ContactInfo
}

export function HeroSection({ content, contactInfo }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid min-h-[23.75em] items-end overflow-hidden rounded-[1.75em] bg-[linear-gradient(112deg,rgba(20,16,13,0.93)_16%,rgba(20,16,13,0.68)_58%,rgba(20,16,13,0.4)_100%),url('https://raw.githubusercontent.com/pengikut-raja-capybara/sentra-genteng-bogorejo/refs/heads/content/public/assets/uploads/hero.webp')] bg-cover bg-center p-8 text-[#fffef9] shadow-[0_0.875em_2.5em_rgba(52,33,13,0.16)] md:min-h-[27.5em] md:p-14"
    >
      <div className="max-w-[45em] animate-[reveal-up_0.72s_ease-out_both]">
        <p className="inline-flex rounded-full border border-white/45 bg-black/15 [padding:0.25em_0.75em] text-xs uppercase tracking-[0.08em] [text-shadow:0_0.08em_0.24em_rgba(0,0,0,0.45)]">
          {content.eyebrow}
        </p>
        <h1
          id="hero-title"
          className="mt-4 font-['Bitter'] text-[clamp(1.75rem,4.2vw,3.15rem)] leading-tight [text-shadow:0_0.09em_0.4em_rgba(0,0,0,0.52)]"
        >
          {content.title}
        </h1>
        <p className="mt-4 max-w-[62ch] text-base/7 text-[#fff8ea] [text-shadow:0_0.08em_0.22em_rgba(0,0,0,0.45)]">
          {content.subtitle}
        </p>
        <a
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[#d66a1f] [padding:0.75em_1.25em] text-sm font-bold text-white transition hover:-translate-y-0.5"
          href={contactInfo.whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          {content.ctaLabel}
        </a>
      </div>
    </section>
  )
}