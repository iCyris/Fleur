import { useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useViewportSize } from '../../hooks/useViewportSize';
import './HeroSection.css';

const TITLE = 'Fleur';
const SUBTITLE = 'RADIANT  IN  ENDLESS  SUMMER';

function MagneticLetter({
  char,
  index,
  letterRef,
  x,
  y,
  rot,
  reduced,
  mobile,
}: {
  char: string;
  index: number;
  letterRef: (el: HTMLSpanElement | null) => void;
  x: any;
  y: any;
  rot: any;
  reduced: boolean;
  mobile: boolean;
}) {
  return (
    <motion.span
      ref={letterRef}
      className='hero__letter'
      style={reduced ? undefined : { x, y, rotate: rot }}
      initial={{
        opacity: 0,
        y: mobile ? 16 : 28,
        ...(mobile ? {} : { letterSpacing: '0.4em' }),
      }}
      animate={{
        opacity: 1,
        y: 0,
        ...(mobile ? {} : { letterSpacing: '0em' }),
      }}
      transition={{
        delay: (mobile ? 0.3 : 0.4) + index * (mobile ? 0.06 : 0.09),
        duration: mobile ? 0.6 : 1.1,
        ease: [0.16, 0.84, 0.24, 1],
      }}
    >
      {char}
    </motion.span>
  );
}

const LETTER_COUNT = TITLE.length;

export default function HeroSection() {
  const reduced = useReducedMotion();
  const { hasHover, isMobile } = useViewportSize();
  const ref = useRef<HTMLElement>(null);

  const letterXs = Array.from({ length: LETTER_COUNT }, () =>
    useMotionValue(0),
  );
  const letterYs = Array.from({ length: LETTER_COUNT }, () =>
    useMotionValue(0),
  );
  const letterRots = Array.from({ length: LETTER_COUNT }, () =>
    useMotionValue(0),
  );
  const letterXSprings = letterXs.map((mv) =>
    useSpring(mv, { stiffness: 140, damping: 14, mass: 0.6 }),
  );
  const letterYSprings = letterYs.map((mv) =>
    useSpring(mv, { stiffness: 140, damping: 14, mass: 0.6 }),
  );
  const letterRotSprings = letterRots.map((mv) =>
    useSpring(mv, { stiffness: 110, damping: 16 }),
  );
  const letterXsRef = useRef(letterXs);
  letterXsRef.current = letterXs;
  const letterYsRef = useRef(letterYs);
  letterYsRef.current = letterYs;
  const letterRotsRef = useRef(letterRots);
  letterRotsRef.current = letterRots;

  const letterEls = useRef<Array<HTMLSpanElement | null>>(
    Array.from({ length: LETTER_COUNT }, () => null),
  );
  const letterCenters = useRef<Array<{ cx: number; cy: number }>>(
    Array.from({ length: LETTER_COUNT }, () => ({ cx: 0, cy: 0 })),
  );
  const recalcCenters = () => {
    for (let i = 0; i < LETTER_COUNT; i++) {
      const el = letterEls.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      letterCenters.current[i] = {
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
      };
    }
  };
  const heroVisible = useRef(true);
  const centersDirty = useRef(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const markDirty = () => {
      centersDirty.current = true;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        heroVisible.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(el);
    window.addEventListener('resize', markDirty, { passive: true });
    window.addEventListener('scroll', markDirty, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('resize', markDirty);
      window.removeEventListener('scroll', markDirty);
    };
  }, []);

  const glowX = useMotionValue(-620);
  const glowY = useMotionValue(-620);
  useEffect(() => {
    if (reduced) return;
    let pending = false;
    let lastX = 0;
    let lastY = 0;

    const apply = () => {
      pending = false;
      if (hasHover) {
        glowX.set(lastX - 310);
        glowY.set(lastY - 310);
      }
      if (!heroVisible.current) return;
      if (centersDirty.current) {
        recalcCenters();
        centersDirty.current = false;
      }
      const radius = 520;
      const xs = letterXsRef.current;
      const ys = letterYsRef.current;
      const rots = letterRotsRef.current;
      for (let i = 0; i < LETTER_COUNT; i++) {
        const { cx, cy } = letterCenters.current[i];
        if (!cx && !cy) continue;
        const dx = lastX - cx;
        const dy = lastY - cy;
        const dist = Math.hypot(dx, dy);
        const t = dist >= radius ? 0 : 1 - dist / radius;
        if (t === 0) {
          xs[i].set(0);
          ys[i].set(0);
          rots[i].set(0);
          continue;
        }
        const pull = 18 * t;
        const inv = 1 / Math.max(1, dist);
        xs[i].set(dx * inv * pull);
        ys[i].set(dy * inv * pull * 0.7);
        rots[i].set((dx / 80) * t * -1.2);
      }
    };

    const update = (cx: number, cy: number) => {
      lastX = cx;
      lastY = cy;
      if (pending) return;
      pending = true;
      requestAnimationFrame(apply);
    };

    const resetLetters = () => {
      const xs = letterXsRef.current;
      const ys = letterYsRef.current;
      const rots = letterRotsRef.current;
      for (let i = 0; i < LETTER_COUNT; i++) {
        xs[i].set(0);
        ys[i].set(0);
        rots[i].set(0);
      }
    };

    const onPointerMove = (e: PointerEvent) => update(e.clientX, e.clientY);

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    if (!hasHover) {
      // Mobile: touchmove keeps effect alive during scroll,
      // reset letters to center when finger lifts or gesture is cancelled.
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          update(e.touches[0].clientX, e.touches[0].clientY);
        }
      };
      const onTouchEnd = () => resetLetters();
      const onTouchCancel = () => resetLetters();
      const onPointerUp = () => resetLetters();
      const onPointerCancel = () => resetLetters();

      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('touchcancel', onTouchCancel);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerCancel);

      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchcancel', onTouchCancel);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerCancel);
      };
    }

    // Desktop: pointermove alone is sufficient, glow follows cursor.
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [hasHover, reduced, glowX, glowY]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const metaY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.05]);

  return (
    <section ref={ref} className='hero' id='hero'>
      <div className='hero__constellation fleur-halftone-coarse' aria-hidden />

      {!reduced && hasHover && (
        <motion.div
          className='hero__cursor-glow'
          aria-hidden
          style={{ x: glowX, y: glowY }}
        />
      )}

      <div className='hero__topbar mono-caps' />

      <motion.div
        className='hero__title-wrap'
        style={reduced ? undefined : { y: titleY, opacity: titleOpacity }}
      >
        <h1 className='hero__title' aria-label={TITLE}>
          {TITLE.split('').map((ch, i) => (
            <MagneticLetter
              key={i}
              char={ch}
              index={i}
              letterRef={(el) => {
                letterEls.current[i] = el;
              }}
              x={letterXSprings[i]}
              y={letterYSprings[i]}
              rot={letterRotSprings[i]}
              reduced={reduced}
              mobile={isMobile}
            />
          ))}
          <span className='hero__title-shimmer' aria-hidden>
            {TITLE}
          </span>
        </h1>

        <motion.div
          className='hero__subtitle mono-caps'
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.9, ease: 'easeOut' }}
        >
          <span className='hero__subtitle-dash' aria-hidden />
          {SUBTITLE}
          <span className='hero__subtitle-dash' aria-hidden />
        </motion.div>
      </motion.div>

      <motion.div
        className='hero__bottombar'
        style={reduced ? undefined : { y: metaY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <div className='hero__scroll-affordance mono-caps'>
          <span className='hero__scroll-bounce'>scroll ↓</span>
        </div>
      </motion.div>
    </section>
  );
}
