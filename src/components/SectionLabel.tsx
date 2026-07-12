import { motion } from 'framer-motion'
import { frameItemVariants, sectionFrameVariants, viewportOnce } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './SectionLabel.css'

interface SectionLabelProps {
  index: string
  title: string
  meta?: string
}

export default function SectionLabel({ index, title, meta }: SectionLabelProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="section-label"
      variants={sectionFrameVariants}
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={viewportOnce}
    >
      <motion.span variants={frameItemVariants} className="section-label__index mono-caps">N°{index}</motion.span>
      <motion.span variants={frameItemVariants} className="section-label__title mono-caps">{title}</motion.span>
      {meta && <motion.span variants={frameItemVariants} className="section-label__meta mono">{meta}</motion.span>}
      <motion.span
        className="section-label__rule"
        aria-hidden
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5, delay: 0.12, ease: 'easeOut' }}
      />
    </motion.div>
  )
}
