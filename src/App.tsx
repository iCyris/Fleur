import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import BreathingLight from './components/BreathingLight'
import GrainLayer from './components/GrainLayer'
import StickerLayer from './components/StickerLayer'
import HeroSection from './components/sections/HeroSection'
import IntroSection from './components/sections/IntroSection'
import WorksSection from './components/sections/WorksSection'
import PlaygroundSection from './components/sections/PlaygroundSection'
import FooterSection from './components/sections/FooterSection'
import PortfolioModal from './components/PortfolioModal'
import './App.css'

export default function App() {
  const playgroundRef = useRef<HTMLElement>(null)
  const [stickerCount, setStickerCount] = useState(0)
  const [portfolioOpen, setPortfolioOpen] = useState(false)

  const [bootDone, setBootDone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={'fleur' + (bootDone ? ' fleur--awake' : '')}>
      <BreathingLight />
      <StickerLayer spawnTargetRef={playgroundRef} onCountChange={setStickerCount} />

      <motion.div
        className="fleur__main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <HeroSection onOpenPortfolio={() => setPortfolioOpen(true)} />
        <IntroSection />
        <WorksSection />
        <PlaygroundSection ref={playgroundRef} stickerCount={stickerCount} />
        <FooterSection />
      </motion.div>

      <GrainLayer />
      <PortfolioModal open={portfolioOpen} onClose={() => setPortfolioOpen(false)} />
    </div>
  )
}
