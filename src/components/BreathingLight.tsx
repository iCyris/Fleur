import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './BreathingLight.css'

export default function BreathingLight() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const haloY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const haloX = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])

  if (reduced) {
    return (
      <div className="breathing-light breathing-light--static" aria-hidden>
        <div className="breathing-light__halo breathing-light__halo--warm" />
        <div className="breathing-light__halo breathing-light__halo--cool" />
      </div>
    )
  }

  return (
    <div className="breathing-light" aria-hidden>
      <motion.div
        className="breathing-light__halo breathing-light__halo--warm"
        style={{ x: haloX, y: haloY }}
      />
      <div
        className="breathing-light__halo breathing-light__halo--cool"
      />
      <div
        className="breathing-light__halo breathing-light__halo--deep"
      />
    </div>
  )
}
