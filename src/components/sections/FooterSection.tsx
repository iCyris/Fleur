import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionLabel from '../SectionLabel';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './FooterSection.css';

const LINES = [
  {
    cmd: 'whoami',
    out: 'cyris',
  },
  { cmd: 'cat ./contact.txt', out: '' },
  { cmd: '  email', out: 'i@cyris.moe' },
  { cmd: '  github', out: 'github.com/iCyris' },
  {
    cmd: 'echo $STATUS',
    out: 'currently @Aliyun',
  },
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
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
        transition={{ duration: 0.9, ease: [0.2, 0.6, 0.2, 1] }}
      >
        <div className='footer__terminal-chrome mono-caps'>
          <span
            className='footer__terminal-dot'
            data-color='amber'
            aria-hidden
          />
          <span
            className='footer__terminal-dot'
            data-color='lavender'
            aria-hidden
          />
          <span
            className='footer__terminal-dot'
            data-color='neon'
            aria-hidden
          />
          <span className='footer__terminal-title'>
            cyris@fleur — bash · 80×24
          </span>
          <span className='footer__terminal-meta'>∞</span>
        </div>

        <div className='footer__terminal-body mono'>
          <div className='footer__line'>
            <span className='footer__prompt'>cyris@fleur:~$</span>
            <span className='footer__cmd'>contact --help</span>
          </div>
          {LINES.map((l, i) => (
            <motion.div
              key={i}
              className='footer__line footer__line--out'
              initial={reduced ? false : { opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.2 + i * 0.08,
                ease: 'easeOut',
              }}
            >
              {l.cmd && <span className='footer__prompt-sm'>↳</span>}
              <span className='footer__cmd-sm'>{l.cmd}</span>
              {l.out && <span className='footer__out'>{l.out}</span>}
            </motion.div>
          ))}
          <div className='footer__line'>
            <span className='footer__prompt'>cyris@fleur:~$</span>
            <span className='footer__caret' aria-hidden />
          </div>
        </div>
      </motion.div>

      <div className='footer__signature'>
        <div className='footer__sig-block mono'>
          <div>FLEUR</div>
          <div>{year} — ∞</div>
        </div>
        <div className='footer__sig-spacer' aria-hidden />
        <div className='footer__sig-block mono footer__sig-right'>
          <div>made by cyris</div>
          <div>
            <span className='signal'>●</span> typeset in system stacks
          </div>
        </div>
      </div>
    </footer>
  );
}
