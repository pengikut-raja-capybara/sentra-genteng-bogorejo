import { useEffect } from 'react'
import type { ReactNode } from 'react'
import logo from '../assets/images/logo.png'

type ContentDetailModalProps = {
  isOpen: boolean
  onClose: () => void
  titleId: string
  maxWidthClass?: string
  heightClass?: string
  layoutClassName?: string
  leftPanel: ReactNode
  rightPanel: ReactNode
}

export function ContentDetailModal({
  isOpen,
  onClose,
  titleId,
  maxWidthClass = 'max-w-[52em]',
  heightClass = 'h-[88vh]',
  layoutClassName = 'lg:grid-cols-[1fr_1.08fr]',
  leftPanel,
  rightPanel,
}: ContentDetailModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed h-full inset-0 z-40 grid place-items-center bg-black/60 p-4 animate-[fade-in_0.24s_ease-out]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className={`${heightClass} w-full ${maxWidthClass} overflow-hidden rounded-2xl bg-[#fffdf9] text-[#241c16] shadow-[0_1em_2.8em_rgba(0,0,0,0.35)] animate-[modal-enter_0.28s_cubic-bezier(0.2,0.9,0.25,1)]`}
      >
        <div
          className={`grid h-full grid-cols-1 grid-rows-[46vh_minmax(0,1fr)] lg:grid-rows-1 ${layoutClassName}`}
        >
          <div className="relative">
            {leftPanel}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 px-2 py-1 rounded-lg bg-white/40 backdrop-blur-md border border-white/50">
              <img
                src={logo}
                alt="Sentra Genteng Bogorejo"
                className="h-6 w-auto"
                loading="lazy"
              />
              <span className="text-[10px] font-semibold text-[#241c16] leading-none">Sentra Genteng Bogorejo</span>
            </div>
          </div>
          {rightPanel}
        </div>
      </div>
    </div>
  )
}
