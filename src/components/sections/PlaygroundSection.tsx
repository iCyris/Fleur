import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SectionLabel from '../SectionLabel';
import { useReducedMotion } from '../../hooks/useReducedMotion';
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
        if (now - last >= 1000) {
          if (fpsRef.current)
            fpsRef.current.textContent = String(frames).padStart(2, '0');
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

        <div className='playground__stage'>
          <motion.h2
            className='playground__headline'
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
            transition={{ duration: 1, ease: [0.2, 0.6, 0.2, 1] }}
          >
            stickers /
            <br />
            <em>memory fragments</em>
          </motion.h2>

          <div className='playground__copy'>
            <p>
              Stickers drift down from beyond the page — some pass through,
              some stick around like small memories. Tap or click anywhere on
              the dark surface to leave one of your own.
            </p>
            <p className='mono'>
              A quiet layer that lives beneath everything — just for fun.
            </p>
          </div>

          <div className='playground__readout mono'>
            <div className='playground__readout-row'>
              <span>stickers_in_flight</span>
              <span>{String(stickerCount).padStart(2, '0')}</span>
            </div>
            <div className='playground__readout-row'>
              <span>render_fps</span>
              <span ref={fpsRef}>60</span>
            </div>
            <div className='playground__readout-row'>
              <span>scroll_velocity</span>
              <span ref={velRef}>0000 px/s</span>
            </div>
            <div className='playground__readout-row'>
              <span>tap_to_spawn</span>
              <span className='signal'>enabled</span>
            </div>
          </div>
        </div>

        <p className='playground__hint mono-caps' aria-hidden>
          Click or tap anywhere in this section to spawn a sticker
        </p>
      </section>
    );
  },
);

export default PlaygroundSection;
