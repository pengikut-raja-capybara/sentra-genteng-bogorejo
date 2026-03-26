import { useEffect, useMemo, useState, type ImgHTMLAttributes } from 'react'
import { resolveContentAssetUrl } from '../utils/contentApi'

type CdnImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
}

export function CdnImage({ src, alt = '', ...props }: CdnImageProps) {
  const optimizedSrc = useMemo(() => resolveContentAssetUrl(src), [src])
  const fallbackSrc = useMemo(() => src.trim(), [src])
  const transparentPixel =
    'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA='
  const [currentSrc, setCurrentSrc] = useState(optimizedSrc)

  useEffect(() => {
    setCurrentSrc(optimizedSrc)
  }, [optimizedSrc])

  const handleError: ImgHTMLAttributes<HTMLImageElement>['onError'] = (event) => {
    if (currentSrc !== fallbackSrc && fallbackSrc.length > 0) {
      setCurrentSrc(fallbackSrc)
    } else if (currentSrc !== transparentPixel) {
      setCurrentSrc(transparentPixel)
    }

    props.onError?.(event)
  }

  return <img src={currentSrc} alt={alt} {...props} onError={handleError} />
}
