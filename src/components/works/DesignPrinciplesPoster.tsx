import { motion } from 'framer-motion'
import { type AnimatedPosterProps, posterEase, reveal } from './posterMotion'

const PRINCIPLES = [
  ['SIMPLICITY', 'var(--seed-fg)'],
  ['TRUST', '#5BC9D6'],
  ['CRAFT', 'var(--seed-lavender)'],
  ['SPEED', 'var(--seed-amber)'],
] as const

export default function DesignPrinciplesPoster({ reduced }: AnimatedPosterProps) {
  return (
    <svg viewBox='0 0 800 600' preserveAspectRatio='xMidYMid slice' className='works__poster'>
      <defs>
        <pattern id='hd-pattern' width='6' height='6' patternUnits='userSpaceOnUse'>
          <circle cx='1.5' cy='1.5' r='1.4' fill='var(--seed-amber)' />
        </pattern>
        <linearGradient id='hd-paper' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='var(--seed-fg)' stopOpacity='0.96' />
          <stop offset='100%' stopColor='var(--seed-fg)' stopOpacity='0.78' />
        </linearGradient>
      </defs>

      <motion.rect
        width='800' height='600' fill='var(--seed-ocean)'
        initial={reduced ? false : { opacity: 0.55 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.72, ease: posterEase }}
      />

      <g>
        <motion.rect
          x='60' y='60' width='500' height='480' fill='url(#hd-paper)'
          initial={reduced ? false : { opacity: 0.12 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.72, delay: 0.18, ease: posterEase }}
        />
        <motion.rect
          x='60' y='60' width='500' height='480' fill='url(#hd-pattern)'
          style={{ mixBlendMode: 'multiply' }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.54, delay: 0.18, ease: posterEase }}
        />
        <g>
          <polygon points='560,60 560,140 480,60' fill='var(--seed-bg)' opacity='0.6' />
          <polyline points='560,60 480,60 560,140' stroke='var(--seed-bg)' strokeWidth='1' fill='none' />
        </g>
        <g fontFamily='ui-monospace, monospace' fill='var(--seed-bg)'>
          <motion.text x='80' y='110' fontSize='14' letterSpacing='3' {...reveal(reduced, 0.4, 0.42)}>DESIGN · PRINCIPLES</motion.text>
        </g>
        <g fill='var(--seed-bg)' opacity='0.85'>
          {!reduced && (
            <>
              <motion.text
                x='80' y='460' fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
                fontWeight='700' fontSize='92' letterSpacing='-4' fill='var(--seed-lavender)'
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: [0, 0.28, 0], x: 0 }}
                transition={{ duration: 0.58, delay: 0.46, ease: posterEase }}
              >Design</motion.text>
              <motion.text
                x='80' y='460' fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
                fontWeight='700' fontSize='92' letterSpacing='-4' fill='var(--seed-amber)'
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: [0, 0.24, 0], x: 0 }}
                transition={{ duration: 0.58, delay: 0.5, ease: posterEase }}
              >Design</motion.text>
            </>
          )}
          <motion.text
            x='80' y='460' fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
            fontWeight='700' fontSize='92' letterSpacing='-4'
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.56, delay: 0.58, ease: posterEase }}
            style={{ transformOrigin: '80px 460px' }}
          >Design</motion.text>
          <motion.text
            x='80' y='510' fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
            fontStyle='italic' fontSize='32' letterSpacing='-1'
            {...reveal(reduced, 0.72, 0.46)}
          >/ principles over features</motion.text>
        </g>
      </g>

      <g fontFamily='ui-monospace, monospace' fontSize='11' fill='var(--seed-fg)' letterSpacing='2'>
        {PRINCIPLES.map(([label, color], index) => {
          const y = 120 + index * 20
          return (
            <motion.g
              key={label}
              initial={reduced ? false : { opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.34, delay: 0.52 + index * 0.07, ease: posterEase }}
              style={{ transformOrigin: `607px ${y - 6}px` }}
            >
              <rect x='600' y={y - 12} width='14' height='14' fill={color} />
              <text x='620' y={y}>{label}</text>
            </motion.g>
          )
        })}
        <motion.text x='600' y='540' opacity='0.6' {...reveal(reduced, 0.78, 0.38)}>less is more</motion.text>
      </g>
    </svg>
  )
}
