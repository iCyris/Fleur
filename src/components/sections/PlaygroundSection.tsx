import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SectionLabel from '../SectionLabel';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  contentGroupVariants,
  contentItemVariants,
  motionEase,
  viewportOnce,
} from '../../lib/motion';
import './PlaygroundSection.css';

interface PlaygroundSectionProps {
  stickerCount: number;
}

const PlaygroundSection = forwardRef<HTMLElement, PlaygroundSectionProps>(
  function PlaygroundSection({ stickerCount }, ref) {
    const reduced = useReducedMotion();
    const sectionRef = useRef<HTMLElement | null>(null);
    const mergedRef = useCallback(
      (node: HTMLElement | null) => {
        sectionRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      },
      [ref],
    );
    const fpsRef = useRef<HTMLSpanElement>(null);
    const velRef = useRef<HTMLSpanElement>(null);
    const lastScroll = useRef({ y: 0, t: 0 });
    const rafRef = useRef(0);

    useEffect(() => {
      const el = sectionRef.current;
      if (!el || reduced) return;

      let frames = 0;
      let last = performance.now();
      const tick = () => {
        frames++;
        const now = performance.now();
        const elapsed = now - last;
        if (elapsed >= 1000) {
          const fps = Math.round((frames * 1000) / elapsed);
          if (fpsRef.current)
            fpsRef.current.textContent = String(fps).padStart(2, '0');
          frames = 0;
          last = now;
        }
        rafRef.current = requestAnimationFrame(tick);
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            frames = 0;
            last = performance.now();
            rafRef.current = requestAnimationFrame(tick);
          } else {
            cancelAnimationFrame(rafRef.current);
          }
        },
        { threshold: 0 },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        cancelAnimationFrame(rafRef.current);
      };
    }, [reduced]);

    useEffect(() => {
      if (reduced) return;
      const onScroll = () => {
        const now = performance.now();
        const dy = window.scrollY - lastScroll.current.y;
        const dt = now - lastScroll.current.t || 1;
        const v = Math.abs(dy / dt) * 1000;
        if (velRef.current)
          velRef.current.textContent = `${Math.round(v).toString().padStart(4, '0')} px/s`;
        lastScroll.current = { y: window.scrollY, t: now };
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, [reduced]);

    return (
      <section
        ref={mergedRef}
        className='playground fleur-grid-faint'
        id='playground'
      >
        <SectionLabel
          index='03'
          title='Playground'
          meta='tap anywhere below to spawn a sticker'
        />

        <motion.div
          className='playground__stage'
          initial={reduced ? false : { opacity: 0.45, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.82, ease: motionEase }}
        >
          <motion.h2
            className='playground__headline'
            variants={contentGroupVariants}
            initial={reduced ? false : 'hidden'}
            whileInView='visible'
            viewport={viewportOnce}
          >
            <motion.span variants={contentItemVariants}>stickers /</motion.span>
            <br />
            <motion.em variants={contentItemVariants}>memory fragments</motion.em>
          </motion.h2>

          <motion.div
            className='playground__copy'
            variants={contentGroupVariants}
            initial={reduced ? false : 'hidden'}
            whileInView='visible'
            viewport={viewportOnce}
          >
            <motion.p variants={contentItemVariants}>
              Stickers drift down from beyond the page — some pass through,
              some stick around like small memories. Tap or click anywhere on
              the dark surface to leave one of your own.
            </motion.p>
            <motion.p variants={contentItemVariants} className='mono'>
              A quiet layer that lives beneath everything — just for fun.
            </motion.p>
          </motion.div>

          <motion.div
            className='playground__readout mono'
            variants={contentGroupVariants}
            initial={reduced ? false : 'hidden'}
            whileInView='visible'
            viewport={viewportOnce}
          >
            <motion.div
              className='playground__readout-frame'
              aria-hidden
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.div variants={contentItemVariants} className='playground__readout-row'>
              <span>stickers_in_flight</span>
              <span>{String(stickerCount).padStart(2, '0')}</span>
            </motion.div>
            <motion.div variants={contentItemVariants} className='playground__readout-row'>
              <span>render_fps</span>
              <span ref={fpsRef}>60</span>
            </motion.div>
            <motion.div variants={contentItemVariants} className='playground__readout-row'>
              <span>scroll_velocity</span>
              <span ref={velRef}>0000 px/s</span>
            </motion.div>
            <motion.div variants={contentItemVariants} className='playground__readout-row'>
              <span>tap_to_spawn</span>
              <span className='signal'>enabled</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <p className='playground__hint mono-caps' aria-hidden>
          Click or tap anywhere in this section to spawn a sticker
        </p>
      </section>
    );
  },
);

export default PlaygroundSection;
