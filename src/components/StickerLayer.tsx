import { useCallback, useEffect, useRef, useState } from 'react'
import {
  STICKER_VARIANTS,
  StickerOutlineDefs,
  type StickerVariant,
} from '../lib/stickerCatalog'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './StickerLayer.css'

interface StickerLayerProps {
  spawnTargetRef?: React.RefObject<HTMLElement>
  onCountChange?: (count: number) => void
}

interface FallingSticker {
  id: number
  variantId: string
  x: number
  topStart: number
  fallDistance: string
  duration: number
  delay: number
  rotStart: number
  rotEnd: number
  driftX: number
  scale: number
}

const PHOTO_STICKER_IDS = ['afu', 'mon', 'yuzi', 'zell']

const FALLING_VARIANTS = STICKER_VARIANTS.filter(
  v => PHOTO_STICKER_IDS.includes(v.id),
)

const variantMap = new Map<string, StickerVariant>(
  STICKER_VARIANTS.map(v => [v.id, v]),
)

const MAX_STICKERS = 15
const OPENING_COUNT = 5
const OPENING_DELAY_MS = 800
const DRIP_MIN_MS = 3000
const DRIP_MAX_MS = 9000

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1))
}

let nextId = 0

function createSticker(
  overrides?: Partial<Pick<FallingSticker, 'x' | 'topStart' | 'delay' | 'fallDistance'>>,
): FallingSticker {
  const variant = FALLING_VARIANTS[randInt(0, FALLING_VARIANTS.length - 1)]
  const isPhoto = ['afu', 'mon', 'yuzi', 'zell'].includes(variant.id)
  const baseScale = isPhoto ? 0.65 : 0.55

  return {
    id: nextId++,
    variantId: variant.id,
    x: overrides?.x ?? rand(3, 92),
    topStart: overrides?.topStart ?? -120,
    fallDistance: overrides?.fallDistance ?? '110vh',
    duration: rand(8, 14),
    delay: overrides?.delay ?? 0,
    rotStart: rand(-15, 15),
    rotEnd: rand(-15, 15) + rand(45, 120) * (Math.random() > 0.5 ? 1 : -1),
    driftX: rand(-40, 40),
    scale: rand(baseScale, baseScale + 0.15),
  }
}

export default function StickerLayer({ spawnTargetRef, onCountChange }: StickerLayerProps) {
  const reduced = useReducedMotion()
  const [stickers, setStickers] = useState<FallingSticker[]>([])
  const dripTimer = useRef<ReturnType<typeof setTimeout>>()

  const removeSticker = useCallback((id: number) => {
    setStickers(prev => prev.filter(s => s.id !== id))
  }, [])

  useEffect(() => {
    onCountChange?.(stickers.length)
  }, [stickers.length, onCountChange])

  useEffect(() => {
    if (reduced) return
    const t = setTimeout(() => {
      const burst: FallingSticker[] = []
      for (let i = 0; i < OPENING_COUNT; i++) {
        burst.push(createSticker({ delay: rand(0, 1.5) }))
      }
      setStickers(burst)
    }, OPENING_DELAY_MS)
    return () => clearTimeout(t)
  }, [reduced])

  useEffect(() => {
    if (reduced) return

    function scheduleDrip() {
      const interval = rand(DRIP_MIN_MS, DRIP_MAX_MS)
      dripTimer.current = setTimeout(() => {
        setStickers(prev => {
          if (prev.length >= MAX_STICKERS) return prev
          return [...prev, createSticker()]
        })
        scheduleDrip()
      }, interval)
    }

    const initialWait = setTimeout(() => {
      scheduleDrip()
    }, OPENING_DELAY_MS + 2000)

    return () => {
      clearTimeout(initialWait)
      clearTimeout(dripTimer.current)
    }
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const target = spawnTargetRef?.current
    if (!target) return

    const onClick = (e: MouseEvent) => {
      const rect = target.getBoundingClientRect()
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100
      const yOffset = e.clientY - 60

      setStickers(prev => {
        if (prev.length >= MAX_STICKERS) return prev
        return [...prev, createSticker({
          x: xPercent,
          topStart: yOffset,
          fallDistance: `${window.innerHeight - yOffset + 100}px`,
        })]
      })
    }

    target.addEventListener('click', onClick)
    return () => target.removeEventListener('click', onClick)
  }, [spawnTargetRef, reduced])

  if (reduced) return null

  return (
    <div className="sticker-layer" aria-hidden>
      <StickerOutlineDefs />
      {stickers.map(s => {
        const variant = variantMap.get(s.variantId)!
        const w = variant.size[0] * s.scale
        const h = variant.size[1] * s.scale
        return (
          <div
            key={s.id}
            className="sticker-layer__item sticker-layer__item--falling"
            style={{
              left: `${s.x}%`,
              top: s.topStart,
              width: w,
              height: h,
              '--fall-duration': `${s.duration}s`,
              '--fall-delay': `${s.delay}s`,
              '--rot-start': `${s.rotStart}deg`,
              '--rot-end': `${s.rotEnd}deg`,
              '--drift-x': `${s.driftX}px`,
              '--fall-distance': s.fallDistance,
            } as React.CSSProperties}
            onAnimationEnd={() => removeSticker(s.id)}
          >
            {variant.render('')}
          </div>
        )
      })}
    </div>
  )
}
