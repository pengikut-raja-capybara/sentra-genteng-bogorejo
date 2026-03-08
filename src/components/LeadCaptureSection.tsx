import type { ContactInfo } from '../types/landing'

type LeadCaptureSectionProps = {
  contactInfo: ContactInfo
  description: string
}

export function LeadCaptureSection({
  contactInfo,
  description,
}: LeadCaptureSectionProps) {
  return (
    <section
      id="kontak"
      className="rounded-3xl border border-[#dccdb8] bg-[linear-gradient(135deg,rgba(214,106,31,0.14),transparent_60%),#fffdf8] p-6 text-center shadow-[0_0.875em_2.5em_rgba(52,33,13,0.16)] md:p-8"
    >
      <h2 className="font-['Bitter'] text-[clamp(1.4rem,2.4vw,2rem)] leading-tight">
        Siap Memesan atau Butuh Sampel?
      </h2>
      <p className="mx-auto mt-3 max-w-[64ch] text-sm text-[#4d443d]">{description}</p>
      <a
        className="mt-5 inline-flex items-center justify-center rounded-full bg-[#a9460b] [padding:0.75em_1.5em] text-sm font-bold text-white transition hover:-translate-y-0.5"
        href={contactInfo.whatsappLink}
        target="_blank"
        rel="noreferrer"
      >
        Chat Sekarang ({contactInfo.displayNumber})
      </a>
    </section>
  )
}