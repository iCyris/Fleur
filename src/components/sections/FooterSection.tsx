import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionLabel from '../SectionLabel';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  contentGroupVariants,
  contentItemVariants,
  motionEase,
  viewportOnce,
} from '../../lib/motion';
import './FooterSection.css';

const LINES = [
  {
    cmd: 'whoami',
    out: 'cyris',
  },
  { cmd: 'cat ./contact.txt', out: '' },
  { cmd: '  email', out: 'i@cyris.moe' },
  { cmd: '  github', out: 'github.com/iCyris' }
];

export default function FooterSection() {
  const reduced = useReducedMotion();
  const [year] = useState(() => '2026');

  useEffect(() => {}, []);

  return (
    <footer className='footer' id='footer'>
      <SectionLabel index='04' title='Contact' meta='reach me by...' />

      <motion.div
        className='footer__terminal'
        initial={reduced ? false : { y: 12, scale: 0.995 }}
        whileInView={{ y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.72, ease: motionEase }}
      >
        <motion.div
          className='footer__terminal-chrome mono-caps'
          variants={contentGroupVariants}
          initial={reduced ? false : 'hidden'}
          whileInView='visible'
          viewport={viewportOnce}
        >
          <motion.span variants={contentItemVariants}
            className='footer__terminal-dot'
            data-color='amber'
            aria-hidden
          />
          <motion.span variants={contentItemVariants}
            className='footer__terminal-dot'
            data-color='lavender'
            aria-hidden
          />
          <motion.span variants={contentItemVariants}
            className='footer__terminal-dot'
            data-color='neon'
            aria-hidden
          />
          <motion.span variants={contentItemVariants} className='footer__terminal-title'>
            cyris@fleur — bash · 80×24
          </motion.span>
          <motion.span variants={contentItemVariants} className='footer__terminal-meta'>∞</motion.span>
        </motion.div>

        <motion.div
          className='footer__terminal-body mono'
          variants={contentGroupVariants}
          initial={reduced ? false : 'hidden'}
          whileInView='visible'
          viewport={viewportOnce}
        >
          <motion.div variants={contentItemVariants} className='footer__line'>
            <span className='footer__prompt'>cyris@fleur:~$</span>
            <span className='footer__cmd'>contact --help</span>
          </motion.div>
          {LINES.map((l, i) => (
            <motion.div
              key={i}
              className='footer__line footer__line--out'
              variants={contentItemVariants}
            >
              {l.cmd && <span className='footer__prompt-sm'>↳</span>}
              <span className='footer__cmd-sm'>{l.cmd}</span>
              {l.out && <span className='footer__out'>{l.out}</span>}
            </motion.div>
          ))}
          <motion.div variants={contentItemVariants} className='footer__line'>
            <span className='footer__prompt'>cyris@fleur:~$</span>
            <span className='footer__caret' aria-hidden />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className='footer__signature'
        initial={false}
      >
        <div className='footer__sig-block mono'>
          <div>FLEUR · {year} — ∞</div>
        </div>
        <div className='footer__sig-spacer' aria-hidden />
        <div className='footer__sig-block mono footer__sig-right'>
          <div className='footer__cultivated'>
            <span className='footer__sprout' aria-hidden>
              <svg viewBox='0 0 18 16' focusable='false'>
                <path d='M8.5 9.4C5.2 9.2 2.4 7 2 2.5c4.4.2 7 2.6 6.5 6.9Z' />
                <path d='M9 9.4c.1-3.4 2.4-6.1 6.8-6.6-.2 4.5-2.7 7.2-6.8 6.6Z' />
                <path
                  className='footer__sprout-stem'
                  d='M8.8 8.8c-.1 1.8.2 3.4.9 4.7'
                />
              </svg>
            </span>
            <span>cultivated by cyris</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
