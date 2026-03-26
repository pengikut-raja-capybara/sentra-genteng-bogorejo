import type { NavItem } from '../types/landing'
import logo from '../assets/images/logo.png'

type HeaderProps = {
  brand: string
  navItems: NavItem[]
}

export function Header({ brand, navItems }: HeaderProps) {
  return (
    <header className="sticky top-3 z-20 flex flex-col gap-4 rounded-2xl border border-[#dccdb8]/80 bg-[#fffdf8]/95 p-4 shadow-[0_0.875em_2.5em_rgba(52,33,13,0.16)] backdrop-blur md:flex-row md:items-center md:justify-between">
      <a
        className="flex items-center gap-2.5 md:gap-3"
        href="#beranda"
      >
        <img
          src={logo}
          alt="Sentra Genteng Bogorejo Logo"
          className="h-8 w-auto md:h-10"
          loading="eager"
        />
        <span className="font-['Bitter'] text-sm font-bold tracking-[0.06em] md:text-base text-[#241c16]">
          {brand}
        </span>
      </a>
      <nav
        aria-label="Navigasi utama"
        className="flex flex-wrap items-center gap-4 text-sm text-[#4d443d]"
      >
        {navItems.map((item) => (
          <a key={item.href} className="transition hover:text-[#a9460b]" href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}