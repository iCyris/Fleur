import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionLabel from '../SectionLabel';
import './IntroSection.css';

const AVATAR_URL = 'https://cdn.jsdelivr.net/npm/cyris/images/avatar.png';

const PULL_QUOTE = '"Thinking in systems, designing with care."';

export default function IntroSection() {
  const [avatarFailed, setAvatarFailed] = useState(false);

  return (
    <section className='intro' id='intro'>
      <SectionLabel index='01' title='About' meta='hi, there' />

      <div className='intro__grid'>
        <motion.div
          className='intro__copy'
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{ duration: 0.9, ease: [0.2, 0.6, 0.2, 1] }}
        >
          <p className='intro__lead lead'>
            I'm <strong>Cyris</strong> — a{' '}
            <em>Human-AI Interaction Engineer</em>.
          </p>

          <p className='intro__quote lead'>{PULL_QUOTE}</p>

          <p className='intro__body'>
            I study how people and AI products work together — the seams
            between human intent and machine capability, the moments where
            trust is made or broken. I believe good AI should be adaptive,
            observable, and context-aware. These convictions shape everything
            I build — from interfaces to evaluations to decision frameworks.
          </p>

          <div className='intro__meta-row mono'>
            <span>index.001</span>
            <span>·</span>
            <span>since 2026</span>
          </div>
        </motion.div>

        <motion.div
          className='intro__portrait'
          initial={{ opacity: 0, rotate: -8, y: 40 }}
          whileInView={{ opacity: 1, rotate: -4, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{ duration: 1.1, ease: [0.2, 0.6, 0.2, 1] }}
        >
          <div className='intro__polaroid'>
            <div className='intro__polaroid-image'>
              {!avatarFailed ? (
                <img
                  src={AVATAR_URL}
                  alt='Portrait of Cyris'
                  loading='lazy'
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <FallbackPortrait />
              )}
              <div
                className='intro__halftone-overlay fleur-halftone'
                aria-hidden
              />
            </div>
            <div className='intro__polaroid-caption mono-caps'>
              <span>cyris · 2026</span>
              <span className='intro__polaroid-frame'>N°024</span>
            </div>
          </div>

          <svg className='intro__annotations' viewBox='0 0 320 360' aria-hidden>
            <g stroke='var(--color-hairline)' strokeWidth='1' fill='none'>
              <path d='M40 50 L 110 90' />
              <path d='M280 60 L 220 110' />
              <path d='M50 320 L 130 270' />
            </g>
            <g
              fill='var(--color-fg)'
              fontFamily='ui-monospace, monospace'
              fontSize='10'
              letterSpacing='1'
            >
              <text x='10' y='44'>
                AGENTS
              </text>
              <text x='232' y='54'>
                HUMAN
              </text>
              <text x='10' y='334'>
                DESIGN
              </text>
            </g>
            <g fill='var(--seed-amber)'>
              <circle cx='40' cy='50' r='2.5' />
              <circle cx='280' cy='60' r='2.5' />
              <circle cx='50' cy='320' r='2.5' />
            </g>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

function FallbackPortrait() {
  return (
    <div className='intro__fallback fleur-halftone' aria-hidden>
      <svg viewBox='0 0 200 240' width='100%' height='100%'>
        <defs>
          <radialGradient id='silhouetteGrad' cx='50%' cy='35%' r='55%'>
            <stop offset='0%' stopColor='var(--seed-amber)' stopOpacity='0.7' />
            <stop
              offset='100%'
              stopColor='var(--seed-ocean)'
              stopOpacity='0.9'
            />
          </radialGradient>
        </defs>
        <rect
          x='0'
          y='0'
          width='200'
          height='240'
          fill='var(--seed-bg-elevated)'
        />
        <circle cx='100' cy='92' r='46' fill='url(#silhouetteGrad)' />
        <path
          d='M 28 240 Q 28 150 100 150 Q 172 150 172 240 Z'
          fill='url(#silhouetteGrad)'
        />
        <text
          x='100'
          y='230'
          textAnchor='middle'
          fontFamily='ui-monospace, monospace'
          fontSize='10'
          letterSpacing='2'
          fill='var(--color-fg)'
          opacity='0.6'
        >
          CYRIS / OFFLINE
        </text>
      </svg>
    </div>
  );
}
