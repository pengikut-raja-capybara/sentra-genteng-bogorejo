type FooterSectionProps = {
  text: string
  keywords: string
}

export function FooterSection({ text, keywords }: FooterSectionProps) {
  return (
    <footer className="mt-5 rounded-2xl bg-[#221d1a] p-4 text-[#fff9f0]">
      <p>{text}</p>
      <p className="mt-2 text-sm text-[#f0d7b8]">{keywords}</p>
    </footer>
  )
}