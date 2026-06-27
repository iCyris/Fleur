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
    let timer = 0
    let scrolling = false
    let scrollTimer = 0
    const onScroll = () => {
      scrolling = true
      clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => { scrolling = false }, 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const tick = () => {
      if (!document.hidden && !scrolling) {
        ctx.putImageData(frames[frameIdx], 0, 0)
        frameIdx = (frameIdx + 1) % FRAME_COUNT
      }
      timer = window.setTimeout(tick, 125)
    }
    timer = window.setTimeout(tick, 125)
    return () => {
      clearTimeout(timer)
      clearTimeout(scrollTimer)
      window.removeEventListener('scroll', onScroll)
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
