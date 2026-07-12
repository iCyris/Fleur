import type { Variants } from 'framer-motion'

export const motionEase = [0.16, 1, 0.3, 1] as const

export const sectionFrameVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.28,
      ease: motionEase,
      staggerChildren: 0.07,
    },
  },
}

export const frameItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: motionEase },
  },
}

export const contentGroupVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.09,
    },
  },
}

export const contentItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: motionEase },
  },
}

export const viewportOnce = {
  once: true,
  margin: '-12% 0px -12% 0px',
} as const
