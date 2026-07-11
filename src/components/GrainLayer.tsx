import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './GrainLayer.css'

export default function GrainLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const GRAIN_W = 128
    const GRAIN_H = 128
    canvas.width = GRAIN_W
    canvas.height = GRAIN_H

    const FRAME_COUNT = 4
    const frames = Array.from({ length: FRAME_COUNT }, () => {
      const img = ctx.createImageData(GRAIN_W, GRAIN_H)
      paintFrame(img.data)
      return img
    })

    if (reduced) {
      ctx.putImageData(frames[0], 0, 0)
      return
    }

    let frameIdx = 0
    let raf = 0
    let lastPaint = 0
    const mobileOrTouch = window.matchMedia('(pointer: coarse), (max-width: 768px)').matches
    const frameInterval = mobileOrTouch ? 160 : 125

    const tick = (now: number) => {
      if (!document.hidden && now - lastPaint >= frameInterval) {
        ctx.putImageData(frames[frameIdx], 0, 0)
        frameIdx = (frameIdx + 1) % FRAME_COUNT
        lastPaint = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="grain-layer" aria-hidden />
}

function paintFrame(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() * 255) | 0
    data[i] = n
    data[i + 1] = (n * 0.96) | 0
    data[i + 2] = (n * 0.85) | 0
    data[i + 3] = 26
  }
}
