import type { CapacityMetric, ContactInfo, HeroContent, NavItem, Product, CreatorCredit, ValuePropositionItem } from "../types/landing";

export const navItems: NavItem[] = [
  { label: "Beranda", href: "#beranda" },
  { label: "Kapasitas Pabrik", href: "#kapasitas" },
  { label: "Katalog Produk", href: "#katalog" },
  { label: "Kontak", href: "#kontak" },
];

export const contactInfo: ContactInfo = {
  displayNumber: "08XX-XXXX-XXXX",
  whatsappLink: "https://wa.me/6281234567890",
};

export const heroContent: HeroContent = {
  eyebrow: "Sentra Genteng Bogorejo, Magetan",
  title: "Pusat Produksi Genteng Terintegrasi",
  subtitle:
    "Kami menyatukan dedikasi ratusan pengrajin ahli dalam satu entitas produksi berskala pabrik. Dapatkan kepastian suplai genteng berkualitas tinggi untuk proyek Anda dengan harga tangan pertama, langsung dari produsen tanpa perantara. Efisiensi biaya material Anda dimulai dari sini.",
  ctaLabel: "Hubungi via WhatsApp",
};

export const capacityMetrics: CapacityMetric[] = [
  {
    label: "Mitra Produksi Terintegrasi",
    value: "XX+",
    detail: "Jaringan pengrajin aktif dan terkoordinasi",
    symbol: "RMH",
  },
  {
    label: "Kapasitas Cetak per Bulan",
    value: "XXX.XXX",
    detail: "Produksi massal untuk kebutuhan proyek",
    symbol: "GTG",
  },
  {
    label: "Kesiapan Distribusi",
    value: "SIAP",
    detail: "Mampu memenuhi pesanan skala besar",
    symbol: "TRK",
  },
];

export const capacityDescription =
  "Kami menggunakan sistem distribusi pesanan (load balancing fisik) agar pesanan besar dikerjakan proporsional oleh seluruh mitra pengrajin, mencegah overload dan menjaga ketepatan waktu pengiriman.";

export const products: Product[] = [
  {
    name: "Genteng Mantili",
    spec: "P x L x T: Menyesuaikan standar produksi",
    usage: "Kebutuhan: X pcs/m2",
    note: "Harga langsung produsen",
  },
  {
    name: "Genteng Garuda",
    spec: "P x L x T: Menyesuaikan standar produksi",
    usage: "Kebutuhan: X pcs/m2",
    note: "Harga langsung produsen",
  },
  {
    name: "Genteng Pres",
    spec: "P x L x T: Menyesuaikan standar produksi",
    usage: "Kebutuhan: X pcs/m2",
    note: "Harga langsung produsen",
  },
];

export const valuePropositions: ValuePropositionItem[] = [
  {
    title: "Kemudahan Negosiasi",
    description: "Bernegosiasi langsung dengan perwakilan desa untuk memutus rantai makelar tradisional dan mendapatkan margin harga terbaik bagi kedua belah pihak.",
  },
  {
    title: "Kemandirian Rantai Pasok",
    description: "Setiap pemesanan mendukung kemandirian ekonomi pengrajin lokal sekaligus memperkuat kapasitas distribusi material konstruksi dari desa ke proyek Anda.",
  },
];

export const contactDescription = "Hubungi kami untuk konsultasi kebutuhan proyek, negosiasi harga, dan pengaturan logistik.";

export const footerText = "Sentra Genteng Bogorejo, Kabupaten Magetan, Jawa Timur.";

export const footerKeywords = "genteng murah | produsen genteng magetan | sentra genteng bogorejo | supplier genteng jawa timur";

export const footerCreditPrefix = "Dibuat oleh ";

export const footerCreditLabel = "Mahasiswa Universitas Siber Asia";

export const footerCreators: CreatorCredit[] = [
  {
    name: "ANGGA ALFIANSAH",
    identifier: "240101010032",
  },
  {
    name: "RISSQI AGUNG RAHMADANI",
    identifier: "240101010038",
  },
  {
    name: "RAJA CAPYBARA YANG BERBUDI LUHUR",
    identifier: "",
  },
];
