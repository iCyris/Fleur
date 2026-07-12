import { motionEase } from '../../lib/motion'

export interface AnimatedPosterProps {
  reduced: boolean
}

export const posterEase = motionEase

export function reveal(reduced: boolean, delay = 0, duration = 0.7) {
  return reduced
    ? { initial: false as const, animate: undefined }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration, delay, ease: posterEase },
      }
}
