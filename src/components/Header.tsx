import type { NavItem } from '../types/landing'

type HeaderProps = {
  brand: string
  navItems: NavItem[]
}

export function Header({ brand, navItems }: HeaderProps) {
  return (
    <header className="sticky top-3 z-20 flex flex-col gap-4 rounded-2xl border border-[#dccdb8]/80 bg-[#fffdf8]/95 p-4 shadow-[0_0.875em_2.5em_rgba(52,33,13,0.16)] backdrop-blur md:flex-row md:items-center md:justify-between">
      <a
        className="font-['Bitter'] text-sm font-bold tracking-[0.06em] md:text-base"
        href="#beranda"
      >
        {brand}
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