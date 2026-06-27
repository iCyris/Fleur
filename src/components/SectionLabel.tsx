import { motion } from 'framer-motion'
import './SectionLabel.css'

interface SectionLabelProps {
  index: string
  title: string
  meta?: string
}

export default function SectionLabel({ index, title, meta }: SectionLabelProps) {
  return (
    <motion.div
      className="section-label"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.7, ease: [0.2, 0.6, 0.2, 1] }}
    >
      <span className="section-label__index mono-caps">N°{index}</span>
      <span className="section-label__title mono-caps">{title}</span>
      {meta && <span className="section-label__meta mono">{meta}</span>}
      <span className="section-label__rule" aria-hidden />
    </motion.div>
  )
}
