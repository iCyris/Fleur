import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { projects } from '../data/projects';
import './PortfolioModal.css';

interface PortfolioModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PortfolioModal({ open, onClose }: PortfolioModalProps) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [openCycle, setOpenCycle] = useState(0);
  const [afuSvgMarkup, setAfuSvgMarkup] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setOpenCycle((cycle) => cycle + 1);
    }
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    let fallbackTimer = 0;
    let idleId: number | null = null;

    const loadAfuSvg = () => {
      fetch('/works-afu-guide.svg')
        .then((response) => (response.ok ? response.text() : null))
        .then((text) => {
          if (!text || cancelled) return;
          setAfuSvgMarkup(text.replace(/^<\?xml[^>]*>\s*/i, ''));
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
        closeRef.current?.focus();
      });
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  /* ---- Esc key ---- */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
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
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
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
        initial: { opacity: 0, y: 10, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.985 },
        transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
      };

  function cardAnim(i: number) {
    if (reduced) return {};
    return {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 22,
        mass: 0.5,
        delay: 0.03 + i * 0.06,
      },
    };
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="portfolio__root">
          {/* ---- Backdrop ---- */}
          <motion.div
            className="portfolio__backdrop"
            onClick={onClose}
            aria-hidden="true"
            {...backdropAnim}
          />

          {/* ---- Panel ---- */}
          <motion.div
            ref={panelRef}
            className="portfolio__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-title"
            {...panelAnim}
          >
            {/* Header */}
            <div className="portfolio__header">
              <span className="portfolio__header-label mono-caps">
                WORKS
                <span className="portfolio__header-sep"> / </span>
                selected projects
              </span>

              <button
                ref={closeRef}
                className="portfolio__close"
                onClick={onClose}
                type="button"
                aria-label="Close portfolio"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="2" y1="2" x2="14" y2="14" />
                  <line x1="14" y1="2" x2="2" y2="14" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="portfolio__body">
              <div className="portfolio__title-row">
                <motion.h2
                  className="portfolio__title"
                  id="portfolio-title"
                  initial={reduced ? {} : { clipPath: 'inset(0 100% 0 0)' }}
                  animate={reduced ? {} : { clipPath: 'inset(0 0% 0 0)' }}
                  transition={{
                    duration: 0.48,
                    delay: 0.04,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                >
                  Selected Works
                </motion.h2>

                <motion.div
                  key={`afu-guide-${openCycle}`}
                  className="portfolio__afu-guide"
                  aria-hidden="true"
                  initial={reduced ? {} : { opacity: 0, y: 4 }}
                  animate={
                    reduced
                      ? {}
                      : {
                          opacity: 1,
                          y: 0,
                        }
                  }
                  transition={{
                    duration: 0.32,
                    delay: 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {afuSvgMarkup ? (
                    <span
                      key={`afu-svg-${openCycle}`}
                      className="portfolio__afu-character portfolio__afu-character--inline"
                      dangerouslySetInnerHTML={{ __html: afuSvgMarkup }}
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
                </motion.div>
              </div>

              <div className="portfolio__grid">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    className="portfolio__card"
                    {...cardAnim(i)}
                  >
                    {/* Card top bar */}
                    <div className="portfolio__card-top">
                      <span className="portfolio__card-index mono-caps">
                        {project.index}
                      </span>
                    </div>
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
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="portfolio__footer mono">
              <span className="signal">●</span>
              catalog · {String(projects.length).padStart(2, '0')} entries
              · curated by cyris
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
