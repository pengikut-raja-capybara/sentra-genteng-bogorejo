import { useEffect, useState } from 'react'
import type { CreatorCredit } from '../types/landing'

type FooterSectionProps = {
  text: string
  keywords: string
  creditPrefix: string
  creditLabel: string
  creators: CreatorCredit[]
}

export function FooterSection({
  text,
  keywords,
  creditPrefix,
  creditLabel,
  creators,
}: FooterSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
    }
  }, [isOpen])

  return (
    <>
      <footer className="mt-5 rounded-2xl bg-[#221d1a] p-4 text-[#fff9f0]">
        <p>{text}</p>
        <p className="mt-2 text-sm text-[#f0d7b8]">{keywords}</p>
        <p className="mt-3 text-sm text-[#f4eadc]">
          {creditPrefix}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="font-semibold text-[#ffd8a8] underline decoration-[#d66a1f]/70 underline-offset-4 transition hover:text-white"
          >
            {creditLabel}
          </button>
        </p>
      </footer>

      {isOpen ? (
        <div
          role="presentation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4 animate-[fade-in_0.24s_ease-out]"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="credit-title"
            className="w-full max-w-[34em] rounded-2xl bg-[#fffdf8] p-5 text-[#1f1a17] shadow-[0_1em_2.8em_rgba(0,0,0,0.35)] animate-[modal-enter_0.28s_cubic-bezier(0.2,0.9,0.25,1)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id="credit-title" className="font-['Bitter'] text-xl leading-tight">
                Detail Pembuat
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-[#dccdb8] px-3 py-1 text-sm text-[#4d443d] transition hover:bg-[#f3ebde]"
                aria-label="Tutup popup detail pembuat"
              >
                Tutup
              </button>
            </div>

            <ul className="mt-4 space-y-3">
              {creators.map((creator) => (
                <li key={`${creator.name}-${creator.identifier}`} className="rounded-xl border border-[#e2d8c8] bg-white p-3">
                  <p className="font-semibold">{creator.name}</p>
                  <p className="mt-1 text-sm text-[#4d443d]">{creator.identifier}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  )
}