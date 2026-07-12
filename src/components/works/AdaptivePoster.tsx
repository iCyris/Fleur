import { motion } from 'framer-motion'
import { type AnimatedPosterProps, posterEase, reveal } from './posterMotion'

export default function AdaptivePoster({ reduced }: AnimatedPosterProps) {
  return (
    <svg viewBox='0 0 800 600' preserveAspectRatio='xMidYMid slice' className='works__poster'>
      <defs>
        <radialGradient id='sm-glow' cx='60%' cy='40%' r='60%'>
          <stop offset='0%' stopColor='var(--seed-amber)' stopOpacity='0.85' />
          <stop offset='60%' stopColor='var(--seed-lavender)' stopOpacity='0.4' />
          <stop offset='100%' stopColor='var(--seed-bg)' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='sm-ink' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='var(--seed-fg)' />
          <stop offset='50%' stopColor='var(--seed-amber)' />
          <stop offset='100%' stopColor='var(--seed-lavender)' />
        </linearGradient>
        <pattern id='sm-dots' width='8' height='8' patternUnits='userSpaceOnUse'>
          <circle cx='2' cy='2' r='1.2' fill='var(--seed-fg)' opacity='0.5' />
        </pattern>
      </defs>

      <rect width='800' height='600' fill='var(--seed-bg-elevated)' />
      <motion.rect
        width='800'
        height='600'
        fill='url(#sm-glow)'
        initial={reduced ? false : { opacity: 0.18 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.18, ease: posterEase }}
      />
      <motion.rect
        width='800'
        height='600'
        fill='url(#sm-dots)'
        initial={reduced ? false : { opacity: 0.03 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 1, delay: 0.16, ease: posterEase }}
      />

      <text
        x='50%'
        y='400'
        textAnchor='middle'
        fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
        fontWeight='700'
        fontSize='200'
        fill='url(#sm-ink)'
        letterSpacing='-6'
      >
        <motion.tspan {...reveal(reduced, 0.16, 0.46)}>Ev</motion.tspan>
        <motion.tspan
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: [0, 0.08, 1] }}
          transition={reduced ? undefined : {
            duration: 0.52,
            delay: 0.46,
            times: [0, 0.28, 1],
            ease: posterEase,
          }}
        >∞</motion.tspan>
        <motion.tspan {...reveal(reduced, 0.16, 0.46)}>lve</motion.tspan>
      </text>

      {!reduced && (
        <text
          x='50%'
          y='400'
          textAnchor='middle'
          fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
          fontWeight='700'
          fontSize='200'
          letterSpacing='-6'
          fill='none'
          aria-hidden='true'
          pointerEvents='none'
        >
          <tspan stroke='none'>Ev</tspan>
          <motion.tspan
            initial={{ strokeOpacity: 0, strokeDashoffset: 180 }}
            animate={{
              strokeOpacity: [0, 0.82, 0.64, 0],
              strokeDashoffset: [180, 72, 0, 0],
            }}
            transition={{
              duration: 0.72,
              delay: 0.32,
              times: [0, 0.2, 0.72, 1],
              ease: posterEase,
            }}
            stroke='var(--seed-fg)'
            strokeWidth='1.4'
            strokeDasharray='18 10'
          >∞</motion.tspan>
          <tspan stroke='none'>lve</tspan>
        </text>
      )}

      <g fontFamily='ui-monospace, monospace' fontSize='12' fill='var(--seed-fg)' opacity='0.7' letterSpacing='2'>
        <motion.text x='60' y='80' {...reveal(reduced, 0.46, 0.38)}>ADAPTIVE SYSTEMS</motion.text>
        <motion.text x='60' y='560' {...reveal(reduced, 0.56, 0.38)}>∞ — evolving with the user</motion.text>
      </g>
      <g stroke='var(--seed-fg)' strokeOpacity='0.6' strokeWidth='1' fill='none'>
        {[100, 540].map((y) => (
          <motion.line
            key={y}
            x1='60' y1={y} x2='740' y2={y}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.36, delay: 0.12, ease: posterEase }}
          />
        ))}
      </g>
    </svg>
  )
}
