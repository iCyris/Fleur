import { useEffect, useState } from 'react'

export interface ViewportSize {
  width: number
  height: number
  isMobile: boolean
  hasHover: boolean
}

function read(): ViewportSize {
  if (typeof window === 'undefined') {
    return { width: 1440, height: 900, isMobile: false, hasHover: true }
  }
  const w = window.innerWidth
  const h = window.innerHeight
  const hasHover = window.matchMedia?.('(hover: hover)').matches ?? true
  return { width: w, height: h, isMobile: w < 768, hasHover }
}

export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>(() => read())

  useEffect(() => {
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setSize(read()))
    }
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('orientationchange', onResize, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return size
}
