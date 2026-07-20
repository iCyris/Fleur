import { useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { type AnimatedPosterProps, posterEase, reveal } from './posterMotion'
import './HumanEdgePoster.css'

const STARS = [[100, 110, 1.4], [220, 80, 1.2], [360, 140, 1.6], [460, 60, 1.2], [540, 220, 1.6]] as const
const TEXT_REVEAL_EASE = [0.33, 0, 0.2, 1] as const

function textReveal(reduced: boolean, delay: number, duration: number) {
  return reduced
    ? { initial: false as const, animate: undefined }
    : {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        transition: { duration, delay, ease: TEXT_REVEAL_EASE },
      }
}

export default function HumanEdgePoster({ reduced }: AnimatedPosterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const updateCursorPosition = (clientX: number, clientY: number) => {
    const rect = wrapperRef.current?.getBoundingClientRect()
    if (!rect) return
    cursorX.set(clientX - rect.left)
    cursorY.set(clientY - rect.top)
  }

  const handleEnter = (e: React.MouseEvent<SVGPathElement>) => {
    updateCursorPosition(e.clientX, e.clientY)
    setHovered(true)
  }

  const handleMove = (e: React.MouseEvent<SVGPathElement>) => {
    updateCursorPosition(e.clientX, e.clientY)
  }

  const handleLeave = () => {
    setHovered(false)
  }

  const handleClick = () => {
    window.open('http://aphotic.cyris.moe/', '_blank', 'noopener,noreferrer')
  }

  const handleKeyDown = (e: React.KeyboardEvent<SVGPathElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div ref={wrapperRef} className='human-edge-poster'>
      <svg viewBox='0 0 800 600' preserveAspectRatio='xMidYMid slice' className='works__poster'>
        <defs>
          <radialGradient id='ng-moon' cx='80%' cy='20%' r='22%'>
            <stop offset='0%' stopColor='var(--seed-amber)' stopOpacity='1' />
            <stop offset='80%' stopColor='var(--seed-amber)' stopOpacity='0.2' />
            <stop offset='100%' stopColor='var(--seed-amber)' stopOpacity='0' />
          </radialGradient>
          <linearGradient id='ng-sky' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#1a1547' />
            <stop offset='100%' stopColor='#06061a' />
          </linearGradient>
          <motion.linearGradient
            id='ng-current'
            gradientUnits='userSpaceOnUse'
            y1='0' y2='0'
            initial={reduced ? false : { x1: -420, x2: -40 }}
            animate={{ x1: 840, x2: 1220 }}
            transition={{ duration: 2.3, delay: 0.58, ease: posterEase }}
          >
            <stop offset='0%' stopColor='var(--seed-fg)' stopOpacity='0' />
            <stop offset='44%' stopColor='var(--seed-fg)' stopOpacity='0.07' />
            <stop offset='56%' stopColor='var(--seed-fg)' stopOpacity='0.07' />
            <stop offset='100%' stopColor='var(--seed-fg)' stopOpacity='0' />
          </motion.linearGradient>
          <mask id='ng-current-mask' maskUnits='userSpaceOnUse' x='0' y='0' width='800' height='600'>
            <path
              d='M -240 460 Q -60 380 120 440 T 560 420 Q 760 396 920 430 Q 1015 452 1080 510 Q 1010 570 900 600 L -240 600 Z'
              fill='white'
              transform='translate(240 0)'
            />
            <path
              d='M -240 510 Q -40 450 160 500 T 560 480 Q 760 458 920 492 Q 1015 514 1080 552 Q 1005 590 900 610 L -240 610 Z'
              fill='black'
              transform='translate(240 0)'
            />
          </mask>
        </defs>

        <rect width='800' height='600' fill='url(#ng-sky)' />
        <motion.rect
          width='800' height='600' fill='url(#ng-moon)'
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.42, ease: posterEase }}
        />
        <motion.circle
          cx='640' cy='120' r='36' fill='var(--seed-amber)'
          initial={reduced ? false : { opacity: 0.24, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.92, delay: 0.16, ease: posterEase }}
          style={{ transformOrigin: '640px 120px' }}
        />

        <g fill='var(--seed-fg)' opacity='0.7'>
          {STARS.map(([cx, cy, r], index) => (
            <motion.circle
              key={`${cx}-${cy}`} cx={cx} cy={cy} r={r}
              initial={reduced ? false : { opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.42, delay: 0.24 + index * 0.11, ease: posterEase }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          ))}
        </g>

        <motion.g
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.82, delay: 0.3, ease: posterEase }}
          transform='translate(240 0)'
        >
          <path
            className='human-edge-poster__hit'
            d='M -240 460 Q -60 380 120 440 T 560 420 Q 760 396 920 430 Q 1015 452 1080 510 Q 1010 570 900 600 L -240 600 Z'
            fill='var(--seed-ocean)'
            opacity='0.64'
            pointerEvents='all'
            style={{ cursor: reduced ? 'pointer' : 'none' }}
            tabIndex={0}
            role='link'
            aria-label='Aphotic'
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onMouseEnter={handleEnter}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
          />
          <path
            d='M -240 510 Q -40 450 160 500 T 560 480 Q 760 458 920 492 Q 1015 514 1080 552 Q 1005 590 900 610 L -240 610 Z'
            fill='#0a0a25'
          />
        </motion.g>
        <rect width='800' height='600' fill='url(#ng-current)' mask='url(#ng-current-mask)' pointerEvents='none' />

        <motion.text
          x='60' y='430' fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
          fontWeight='500' fontSize='76' fill='var(--seed-fg)' letterSpacing='-2'
          {...textReveal(reduced, 0.56, 0.72)}
        >the human</motion.text>
        <motion.text
          x='60' y='495' fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
          fontWeight='300' fontStyle='italic' fontSize='46' fill='var(--seed-amber)' letterSpacing='-1'
          {...textReveal(reduced, 0.72, 0.64)}
        >edge.</motion.text>
      </svg>
      {!reduced && (
        <motion.div
          className='human-edge-poster__cursor'
          style={{ x: cursorX, y: cursorY }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
        >
          <span className='human-edge-poster__cursor-ring' />
        </motion.div>
      )}
    </div>
  )
}
