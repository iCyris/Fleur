import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { projects } from '../data/projects';
import './PortfolioModal.css';

interface PortfolioModalProps {
  open: boolean;
  onToggle: () => void;
}

const SHEET_COUNT = 3;
const SHEET_DURATION_S = 0.35;
const SHEET_STAGGER_S = 0.1;
const SHEETS_COMPLETE_S =
  SHEET_DURATION_S + (SHEET_COUNT - 1) * SHEET_STAGGER_S;
const AFU_REVEAL_DELAY_MS = SHEETS_COMPLETE_S * 1000;

export default function PortfolioModal({ open, onToggle }: PortfolioModalProps) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyShellRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closingMorphTimerRef = useRef<number | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const afuSvgMarkupRef = useRef<string | null>(null);
  const [openCycle, setOpenCycle] = useState(0);
  const [afuReady, setAfuReady] = useState(false);
  const [closingMorph, setClosingMorph] = useState(false);
  const [afuMarkupForCycle, setAfuMarkupForCycle] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !bodyRef.current || !bodyShellRef.current) return;

    const body = bodyRef.current;
    const shell = bodyShellRef.current;
    const fadeDistance = 40;
    const smoothstep = (value: number) => value * value * (3 - 2 * value);
    const updateScrollEdges = () => {
      const maxScrollTop = Math.max(0, body.scrollHeight - body.clientHeight);
      const remainingScroll = Math.max(0, maxScrollTop - body.scrollTop);
      const topProgress = Math.min(1, Math.max(0, body.scrollTop / fadeDistance));
      const bottomProgress = maxScrollTop === 0
        ? 0
        : Math.min(1, remainingScroll / fadeDistance);
      const topEdgeAlpha = 1 - smoothstep(topProgress);
      const bottomEdgeAlpha = maxScrollTop === 0
        ? 1
        : 1 - smoothstep(bottomProgress);

      shell.style.setProperty('--portfolio-mask-top-alpha', topEdgeAlpha.toFixed(3));
      shell.style.setProperty('--portfolio-mask-bottom-alpha', bottomEdgeAlpha.toFixed(3));
    };

    updateScrollEdges();
    const frame = window.requestAnimationFrame(updateScrollEdges);
    const resizeObserver = new ResizeObserver(updateScrollEdges);
    resizeObserver.observe(body);
    if (body.firstElementChild) resizeObserver.observe(body.firstElementChild);
    body.addEventListener('scroll', updateScrollEdges, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      body.removeEventListener('scroll', updateScrollEdges);
    };
  }, [open, openCycle]);

  useEffect(() => {
    return () => {
      if (closingMorphTimerRef.current !== null) {
        window.clearTimeout(closingMorphTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setAfuReady(false);
      setAfuMarkupForCycle(null);
      return;
    }

    if (reduced) {
      setAfuMarkupForCycle(afuSvgMarkupRef.current);
      setAfuReady(true);
      return;
    }

    const timer = window.setTimeout(() => {
      // Freeze the rendering carrier for this open cycle. If the inline SVG
      // finishes preloading later, switching from <img> to inline <svg> here
      // would remount the asset and restart its internal animation timeline.
      setAfuMarkupForCycle(afuSvgMarkupRef.current);
      setAfuReady(true);
    }, AFU_REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [open, reduced]);

  useEffect(() => {
    let cancelled = false;
    let fallbackTimer = 0;
    let idleId: number | null = null;

    const loadAfuSvg = () => {
      fetch('/works-afu-guide.svg')
        .then((response) => (response.ok ? response.text() : null))
        .then((text) => {
          if (!text || cancelled) return;
          const markup = text.replace(/^<\?xml[^>]*>\s*/i, '');
          afuSvgMarkupRef.current = markup;
        })
        .catch(() => {
          /* Decorative enhancement only. The img fallback still works. */
        });
    };

    const requestIdle = window.requestIdleCallback as
      | ((callback: () => void) => number)
      | undefined;
    const cancelIdle = window.cancelIdleCallback as
      | ((handle: number) => void)
      | undefined;

    if (requestIdle) {
      idleId = requestIdle(loadAfuSvg);
    } else {
      fallbackTimer = window.setTimeout(loadAfuSvg, 900);
    }

    return () => {
      cancelled = true;
      if (idleId !== null && cancelIdle) cancelIdle(idleId);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  /* ---- scroll lock ---- */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /* ---- focus management ---- */
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        toggleRef.current?.focus();
      });
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  const handleToggle = useCallback(() => {
    if (closingMorphTimerRef.current !== null) {
      window.clearTimeout(closingMorphTimerRef.current);
      closingMorphTimerRef.current = null;
    }

    const instantTouchToggle = window.matchMedia(
      '(hover: none) and (pointer: coarse)',
    ).matches;

    if (open) {
      if (!reduced && !instantTouchToggle) {
        setClosingMorph(true);
        closingMorphTimerRef.current = window.setTimeout(() => {
          setClosingMorph(false);
          closingMorphTimerRef.current = null;
        }, 440);
      } else {
        setClosingMorph(false);
      }
    } else {
      setClosingMorph(false);
      setOpenCycle((cycle) => cycle + 1);
    }

    onToggle();
  }, [open, reduced, onToggle]);

  /* ---- Esc key ---- */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleToggle();
    },
    [handleToggle],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  /* ---- focus trap ---- */
  const handleTabTrap = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const panelFocusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const focusable = [
      ...(toggleRef.current ? [toggleRef.current] : []),
      ...Array.from(panelFocusable),
    ];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleTabTrap);
      return () => document.removeEventListener('keydown', handleTabTrap);
    }
  }, [open, handleTabTrap]);

  /* ---- animation presets ---- */
  const backdropAnim = reduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2, ease: 'easeOut' },
      };

  const panelAnim = reduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { duration: 0.26, delay: 0.48, ease: 'easeOut' },
        },
        exit: {
          opacity: 0,
          transition: { duration: 0.2, ease: 'easeOut' },
        },
      };

  function sheetAnim(index: number) {
    if (reduced) return {};
    return {
      initial: { rotate: 90 },
      animate: {
        rotate: 0,
        transition: {
          duration: SHEET_DURATION_S,
          delay: index * SHEET_STAGGER_S,
          ease: 'easeInOut',
        },
      },
      exit: {
        rotate: -90,
        transition: {
          duration: SHEET_DURATION_S,
          delay: (SHEET_COUNT - 1 - index) * SHEET_STAGGER_S,
          ease: 'easeInOut',
        },
      },
    };
  }

  function cardAnim(i: number) {
    if (reduced) return {};
    return {
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.24,
        delay: 0.02 + i * 0.04,
        ease: [0.22, 1, 0.36, 1],
      },
    };
  }

  return (
    <>
      <button
        ref={toggleRef}
        className={
          'portfolio-toggle' +
          (open ? ' portfolio-toggle--open' : '') +
          (closingMorph ? ' portfolio-toggle--closing' : '')
        }
        onClick={handleToggle}
        type="button"
        aria-label={open ? 'Close portfolio' : 'Open portfolio'}
        aria-expanded={open}
        aria-controls="portfolio-dialog"
      >
        <span className="portfolio-toggle__line" />
        <span className="portfolio-toggle__line" />
        <span className="portfolio-toggle__line" />
      </button>

      <AnimatePresence>
        {open && (
        <div key={`portfolio-${openCycle}`} ref={panelRef} className="portfolio__root">
          {/* ---- Backdrop ---- */}
          <motion.div
            className="portfolio__backdrop"
            onClick={handleToggle}
            aria-hidden="true"
            {...backdropAnim}
          />

          <div className="portfolio__sheets" aria-hidden="true">
            <motion.div className="portfolio__sheet portfolio__sheet--orchid" {...sheetAnim(0)} />
            <motion.div className="portfolio__sheet portfolio__sheet--botanical" {...sheetAnim(1)} />
            <motion.div className="portfolio__sheet portfolio__sheet--paper" {...sheetAnim(2)} />
          </div>

          {/* ---- Panel ---- */}
          <motion.div
            id="portfolio-dialog"
            className="portfolio__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-title"
            {...panelAnim}
          >
            <div className="portfolio__title-row">
              <div className="portfolio__title-copy">
                <div className="portfolio__title-meta mono-caps">
                  Portfolio / {String(projects.length).padStart(2, '0')} entries
                </div>
                <div className="portfolio__title-main">
                  <h2 className="portfolio__title" id="portfolio-title">
                    Works
                  </h2>

                  {afuReady && (
                    <div
                      key={`afu-guide-${openCycle}`}
                      className="portfolio__afu-guide"
                      aria-hidden="true"
                    >
                      {afuMarkupForCycle ? (
                        <span
                          key={`afu-svg-${openCycle}`}
                          className="portfolio__afu-character portfolio__afu-character--inline"
                          dangerouslySetInnerHTML={{ __html: afuMarkupForCycle }}
                        />
                      ) : (
                        <img
                          key={`afu-img-${openCycle}`}
                          className="portfolio__afu-character"
                          src="/works-afu-guide.svg"
                          alt=""
                          draggable="false"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div ref={bodyShellRef} className="portfolio__body-shell">
              <div ref={bodyRef} className="portfolio__body">
                <div className="portfolio__grid">
                  {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    className="portfolio__card"
                    {...cardAnim(i)}
                  >
                    <div className="portfolio__card-surface">
                      {/* Card top bar */}
                      <div className="portfolio__card-top">
                        <span className="portfolio__card-index mono-caps">
                          {project.index}
                        </span>
                      </div>

                      <div className="portfolio__card-paper">
                        <div className="portfolio__card-rule" aria-hidden="true" />

                        {/* Content */}
                        <h3 className="portfolio__card-name">{project.name}</h3>
                        <p className="portfolio__card-desc">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="portfolio__card-tags">
                          {project.tags.map((tag) => (
                            <span key={tag} className="portfolio__card-tag mono">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Links */}
                        <div className="portfolio__card-links">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio__link"
                        aria-label={`Open ${project.name} on GitHub`}
                      >
                        {/* GitHub icon */}
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                        <span>GitHub</span>
                        {/* External arrow */}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className="portfolio__link-arrow"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>

                      {project.showcaseUrl && (
                        <a
                          href={project.showcaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="portfolio__link"
                          aria-label={`View ${project.name} showcase`}
                        >
                          {/* Globe icon */}
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                          </svg>
                          <span>Showcase</span>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className="portfolio__link-arrow"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </a>
                      )}

                      {project.extraUrl && (
                        <a
                          href={project.extraUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="portfolio__link"
                          aria-label={`Open ${project.name} ${project.extraLabel || 'extra link'}`}
                        >
                          {/* Book icon */}
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                          </svg>
                          <span>{project.extraLabel || 'Extra'}</span>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className="portfolio__link-arrow"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </a>
                      )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer stays outside the scroll container. */}
            <div className="portfolio__footer mono">
              <span className="portfolio__sprout" aria-hidden="true">
                <svg viewBox="0 0 18 16" focusable="false">
                  <path
                    className="portfolio__sprout-stem"
                    d="M9 14.25C8.9 10.9 9.08 8.05 9.45 5.8"
                  />
                  <path
                    className="portfolio__sprout-leaf portfolio__sprout-leaf--left"
                    d="M8.9 10.8C6.1 10.65 4.55 9.25 4.2 7.05C6.45 7.15 8.15 8.25 8.9 10.8Z"
                  />
                  <path
                    className="portfolio__sprout-leaf portfolio__sprout-leaf--right"
                    d="M9.15 8.7C10.05 6.35 11.65 5.25 13.75 5.35C13.35 7.6 11.8 8.75 9.15 8.7Z"
                  />
                  <path
                    className="portfolio__sprout-bud"
                    d="M9.55 6.2C7.7 5.3 7.1 3.55 8.15 1.65C10.2 2.05 11.15 3.6 10.3 5.55C10.1 5.95 9.85 6.15 9.55 6.2Z"
                  />
                </svg>
              </span>
              every work carries a flower’s name
            </div>
          </motion.div>
        </div>
        )}
      </AnimatePresence>
    </>
  );
}
