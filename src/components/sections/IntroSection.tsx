import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionLabel from '../SectionLabel';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  contentGroupVariants,
  contentItemVariants,
  motionEase,
  viewportOnce,
} from '../../lib/motion';
import './IntroSection.css';

const AVATAR_URL = 'https://cdn.jsdelivr.net/npm/cyris/images/avatar.png';

const PULL_QUOTE = '"Thinking in systems, designing with care."';

const ANNOTATIONS = [
  {
    path: 'M40 50 L110 90',
    label: 'AGENTS',
    labelX: 10,
    labelY: 44,
    dotX: 40,
    dotY: 50,
  },
  {
    path: 'M280 60 L220 110',
    label: 'HUMAN',
    labelX: 232,
    labelY: 54,
    dotX: 280,
    dotY: 60,
  },
  {
    path: 'M50 320 L130 270',
    label: 'DESIGN',
    labelX: 10,
    labelY: 334,
    dotX: 50,
    dotY: 320,
  },
] as const;

const annotationEase = [0.22, 0.72, 0.18, 1] as const;

export default function IntroSection() {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const reduced = useReducedMotion();

  return (
    <section className='intro' id='intro'>
      <SectionLabel index='01' title='About' meta='hi, there' />

      <div className='intro__grid'>
        <motion.div
          className='intro__copy'
          variants={contentGroupVariants}
          initial={reduced ? false : 'hidden'}
          whileInView='visible'
          viewport={viewportOnce}
        >
          <motion.p variants={contentItemVariants} className='intro__lead lead'>
            I'm <strong>Cyris</strong> — a{' '}
            <em>Human-AI Interaction Engineer</em>.
          </motion.p>

          <motion.p variants={contentItemVariants} className='intro__quote lead'>{PULL_QUOTE}</motion.p>

          <motion.p variants={contentItemVariants} className='intro__body'>
            I study how people and AI products work together — the seams
            between human intent and machine capability, the moments where
            trust is made or broken. I believe good AI should be adaptive,
            observable, and context-aware. These convictions shape everything
            I build — from interfaces to evaluations to decision frameworks.
          </motion.p>

        </motion.div>

        <motion.div
          className='intro__portrait'
          initial={reduced ? false : { opacity: 0, rotate: -4.8, y: 14, scale: 0.988 }}
          whileInView={{ opacity: 1, rotate: -4, y: 0, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.16, delay: 0.08, ease: annotationEase }}
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

          <motion.svg
            className='intro__annotations'
            viewBox='0 0 320 360'
            aria-hidden
            initial={reduced ? false : 'hidden'}
            whileInView='visible'
            viewport={viewportOnce}
          >
            <g className='intro__annotation-lines' fill='none'>
              {ANNOTATIONS.map(({ path }, index) => (
                <motion.path
                  key={path}
                  d={path}
                  vectorEffect='non-scaling-stroke'
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: {
                      pathLength: 1,
                      opacity: [0, 0.82, 1],
                      transition: {
                        pathLength: {
                          duration: 0.46,
                          delay: 0.18 + index * 0.06,
                          ease: annotationEase,
                        },
                        opacity: {
                          duration: 0.28,
                          delay: 0.18 + index * 0.06,
                          times: [0, 0.18, 1],
                          ease: 'linear',
                        },
                      },
                    },
                  }}
                />
              ))}
            </g>
            <g
              fill='var(--color-fg)'
              fontFamily='ui-monospace, monospace'
              fontSize='10'
              letterSpacing='1'
            >
              {ANNOTATIONS.map(({ label, labelX, labelY }, index) => (
                <motion.text
                  key={label}
                  x={labelX}
                  y={labelY}
                  variants={{
                    hidden: { opacity: 0, y: 2 },
                    visible: {
                      opacity: 0.9,
                      y: 0,
                      transition: {
                        duration: 0.36,
                        delay: 0.6 + index * 0.06,
                        ease: annotationEase,
                      },
                    },
                  }}
                >
                  {label}
                </motion.text>
              ))}
            </g>
            <g className='intro__annotation-dots' fill='var(--seed-amber)'>
              {ANNOTATIONS.map(({ label, dotX, dotY }, index) => (
                <motion.circle
                  key={`${label}-dot`}
                  cx={dotX}
                  cy={dotY}
                  r='2.35'
                  variants={{
                    hidden: { opacity: 0, scale: 0.72 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.32,
                        delay: 0.1 + index * 0.06,
                        ease: annotationEase,
                      },
                    },
                  }}
                  style={{ transformOrigin: `${dotX}px ${dotY}px` }}
                />
              ))}
            </g>
          </motion.svg>
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
