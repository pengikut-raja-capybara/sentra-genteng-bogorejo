export type GitHubContentFileEntry = {
  name: string
  path: string
  sha: string
  size: number
  download_url: string | null
  type: 'file' | 'dir'
}

export type ProductContent = {
  id: string
  name: string
  specification: string
  usagePerSquareMeter: string
  wholesalePrice: string
  retailPrice: string
  images: string[]
}

export type ProductionHouseContent = {
  id: string
  name: string
  address: string
  moldingCapacity: string
  furnaceCapacity: string
  workersInfo: string
  dormantStock: string
  photos: string[]
}
