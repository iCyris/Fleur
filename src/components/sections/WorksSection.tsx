import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import SectionLabel from '../SectionLabel';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './WorksSection.css';

interface WorkItem {
  term: string;
  desc: string;
}

interface Work {
  index: string;
  title: string;
  year: string;
  medium: string;
  items: WorkItem[];
  Poster: React.FC;
}

const WORKS: Work[] = [
  {
    index: '001',
    title: 'Good AI Product',
    year: 'Pillar',
    medium: 'Philosophy · AI Engineering',
    items: [
      {
        term: 'Adaptive',
        desc: 'evolving with user behavior, not just responding to it.',
      },
      {
        term: 'Observable',
        desc: 'letting people see and understand what the AI is doing.',
      },
      {
        term: 'Context-aware',
        desc: 'reading the situation, not just the input.',
      },
    ],
    Poster: PosterSoftMachines,
  },
  {
    index: '002',
    title: 'Good Design Principles',
    year: 'Pillar',
    medium: 'Philosophy · Product Design',
    items: [
      { term: 'Simplicity', desc: 'simple surface, deep power.' },
      { term: 'Trust', desc: 'earned by design, not assumed by default.' },
      { term: 'Craft', desc: 'knowing what to leave out matters.' },
      { term: 'Speed', desc: 'responsiveness shapes perception.' },
    ],
    Poster: PosterHalftoneDiary,
  },
  {
    index: '003',
    title: 'The Human Edge',
    year: 'Pillar',
    medium: 'Philosophy · Human Nature',
    items: [
      { term: 'Taste', desc: 'telling good from bad; irreplaceable by AI.' },
      { term: 'Judgment', desc: 'making decisions in chaos.' },
      {
        term: 'Questioning',
        desc: 'asking the right question beats finding the answer.',
      },
      { term: 'Synthesis', desc: 'assembling fragments into a whole.' },
      {
        term: 'Creativity',
        desc: 'born from lived experience and happy accidents.',
      },
    ],
    Poster: PosterNightGarden,
  },
];

export default function WorksSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return (
    <section ref={ref} className='works' id='works'>
      <SectionLabel index='02' title='Good AI Product' meta='three pillars' />

      <div className='works__pagination mono'>
        <span>CHORD</span>
        <span>·</span>
        <motion.span className='works__pagination-count'>
          01 ↔ 0{WORKS.length}
        </motion.span>
      </div>

      <ul className='works__list'>
        {WORKS.map((work, i) => (
          <WorkCard
            key={work.index}
            work={work}
            reduced={reduced}
            progress={scrollYProgress}
            cardIndex={i}
            total={WORKS.length}
          />
        ))}
      </ul>

      <div className='works__footnote mono'>
        <span className='signal'>●</span>
        tools evolve, principles endure — the human edge is what stays.
      </div>
    </section>
  );
}

interface WorkCardProps {
  work: Work;
  reduced: boolean;
  progress: MotionValue<number>;
  cardIndex: number;
  total: number;
}

function WorkCard({
  work,
  reduced,
  progress,
  cardIndex,
  total,
}: WorkCardProps) {
  const start = cardIndex / total;
  const end = (cardIndex + 1) / total;

  const imageY = useTransform(
    progress,
    [start - 0.1, end + 0.1],
    ['10%', '-10%'],
  );
  const captionY = useTransform(
    progress,
    [start - 0.1, end + 0.1],
    ['-4%', '6%'],
  );

  const Poster = work.Poster;

  return (
    <li className='works__card'>
      <motion.div
        className='works__media'
        style={reduced ? undefined : { y: imageY }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <div className='works__media-inner'>
          <Poster />
          <div className='works__media-grid fleur-grid-faint' aria-hidden />
        </div>
        <div className='works__index mono-caps'>N°{work.index}</div>
      </motion.div>

      <motion.div
        className='works__caption'
        style={reduced ? undefined : { y: captionY }}
      >
        <motion.div
          className='works__caption-inner'
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.2, 0.6, 0.2, 1] }}
        >
          <div className='works__caption-meta mono-caps'>
            <span>{work.year}</span>
            <span className='works__caption-dot' aria-hidden />
            <span>{work.medium}</span>
          </div>
          <h3 className='works__title'>{work.title}</h3>
          <ul className='works__blurb'>
            {work.items.map((item) => (
              <li key={item.term}>
                <strong>{item.term}:</strong> {item.desc}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </li>
  );
}

/* ---------- Generative SVG posters (placeholder visuals) ---------- */

function PosterSoftMachines() {
  return (
    <svg
      viewBox='0 0 800 600'
      preserveAspectRatio='xMidYMid slice'
      className='works__poster'
    >
      <defs>
        <radialGradient id='sm-glow' cx='60%' cy='40%' r='60%'>
          <stop offset='0%' stopColor='var(--seed-amber)' stopOpacity='0.85' />
          <stop
            offset='60%'
            stopColor='var(--seed-lavender)'
            stopOpacity='0.4'
          />
          <stop offset='100%' stopColor='var(--seed-bg)' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='sm-ink' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='var(--seed-fg)' />
          <stop offset='50%' stopColor='var(--seed-amber)' />
          <stop offset='100%' stopColor='var(--seed-lavender)' />
        </linearGradient>
        <pattern
          id='sm-dots'
          width='8'
          height='8'
          patternUnits='userSpaceOnUse'
        >
          <circle cx='2' cy='2' r='1.2' fill='var(--seed-fg)' opacity='0.5' />
        </pattern>
      </defs>
      <rect width='800' height='600' fill='var(--seed-bg-elevated)' />
      <rect width='800' height='600' fill='url(#sm-glow)' />
      <rect width='800' height='600' fill='url(#sm-dots)' opacity='0.18' />
      <text
        x='50%'
        y='400'
        textAnchor='middle'
        fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
        fontWeight='700'
        fontSize='200'
        fill='url(#sm-ink)'
        letterSpacing='-6'
      >
        Ev∞lve
      </text>
      <g
        fontFamily='ui-monospace, monospace'
        fontSize='12'
        fill='var(--seed-fg)'
        opacity='0.7'
        letterSpacing='2'
      >
        <text x='60' y='60'>
          AI PRODUCTS · ADAPTIVE SYSTEMS
        </text>

        <text x='60' y='560'>
          ∞ — evolving with the user
        </text>
      </g>
      <g
        stroke='var(--seed-fg)'
        strokeOpacity='0.6'
        strokeWidth='1'
        fill='none'
      >
        <line x1='60' y1='100' x2='740' y2='100' />
        <line x1='60' y1='540' x2='740' y2='540' />
      </g>
      <g fill='var(--seed-neon)'>
        <circle cx='720' cy='60' r='3' />
      </g>
    </svg>
  );
}

function PosterHalftoneDiary() {
  return (
    <svg
      viewBox='0 0 800 600'
      preserveAspectRatio='xMidYMid slice'
      className='works__poster'
    >
      <defs>
        <pattern
          id='hd-pattern'
          width='6'
          height='6'
          patternUnits='userSpaceOnUse'
        >
          <circle cx='1.5' cy='1.5' r='1.4' fill='var(--seed-amber)' />
        </pattern>
        <linearGradient id='hd-paper' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='var(--seed-fg)' stopOpacity='0.96' />
          <stop offset='100%' stopColor='var(--seed-fg)' stopOpacity='0.78' />
        </linearGradient>
      </defs>
      <rect width='800' height='600' fill='var(--seed-ocean)' />
      <rect x='60' y='60' width='500' height='480' fill='url(#hd-paper)' />
      <rect
        x='60'
        y='60'
        width='500'
        height='480'
        fill='url(#hd-pattern)'
        opacity='0.6'
        style={{ mixBlendMode: 'multiply' }}
      />
      <polygon
        points='560,60 560,140 480,60'
        fill='var(--seed-bg)'
        opacity='0.6'
      />
      <polyline
        points='560,60 480,60 560,140'
        stroke='var(--seed-bg)'
        strokeWidth='1'
        fill='none'
      />
      <g fontFamily='ui-monospace, monospace' fill='var(--seed-bg)'>
        <text x='80' y='110' fontSize='14' letterSpacing='3'>
          DESIGN · PRINCIPLES
        </text>
      </g>
      <g fill='var(--seed-bg)' opacity='0.85'>
        <text
          x='80'
          y='460'
          fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
          fontWeight='700'
          fontSize='92'
          letterSpacing='-4'
        >
          Design
        </text>
        <text
          x='80'
          y='510'
          fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
          fontStyle='italic'
          fontSize='32'
          letterSpacing='-1'
        >
          / principles over features
        </text>
      </g>
      <g
        fontFamily='ui-monospace, monospace'
        fontSize='11'
        fill='var(--seed-fg)'
        letterSpacing='2'
      >
        <text x='620' y='120'>
          SIMPLICITY
        </text>
        <text x='620' y='140'>
          TRUST
        </text>
        <text x='620' y='160'>
          CRAFT
        </text>
        <text x='620' y='180'>
          SPEED
        </text>
        <text x='600' y='540' opacity='0.6'>
          ∞ — less is more
        </text>
      </g>
      <g>
        <rect x='600' y='108' width='14' height='14' fill='var(--seed-fg)' />
        <rect x='600' y='128' width='14' height='14' fill='#5BC9D6' />
        <rect
          x='600'
          y='148'
          width='14'
          height='14'
          fill='var(--seed-lavender)'
        />
        <rect x='600' y='168' width='14' height='14' fill='var(--seed-amber)' />
      </g>
    </svg>
  );
}

function PosterNightGarden() {
  return (
    <svg
      viewBox='0 0 800 600'
      preserveAspectRatio='xMidYMid slice'
      className='works__poster'
    >
      <defs>
        <radialGradient id='ng-moon' cx='80%' cy='20%' r='22%'>
          <stop offset='0%' stopColor='var(--seed-amber)' stopOpacity='1' />
          <stop offset='80%' stopColor='var(--seed-amber)' stopOpacity='0.2' />
          <stop offset='100%' stopColor='var(--seed-amber)' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='ng-sky' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#1a1547' />
          <stop offset='100%' stopColor='#06061a' />
        </linearGradient>
      </defs>
      <rect width='800' height='600' fill='url(#ng-sky)' />
      <rect width='800' height='600' fill='url(#ng-moon)' />
      <path
        d='M 0 460 Q 180 380 360 440 T 800 420 L 800 600 L 0 600 Z'
        fill='var(--seed-ocean)'
        opacity='0.7'
      />
      <path
        d='M 0 510 Q 200 450 400 500 T 800 480 L 800 600 L 0 600 Z'
        fill='#0a0a25'
      />
      <g stroke='var(--seed-lavender)' strokeWidth='2' strokeLinecap='round'>
        <line x1='80' y1='520' x2='80' y2='480' />
        <line x1='120' y1='540' x2='120' y2='490' />
        <line x1='180' y1='530' x2='180' y2='470' />
        <line x1='260' y1='540' x2='260' y2='510' />
        <line x1='320' y1='540' x2='320' y2='495' />
        <line x1='540' y1='540' x2='540' y2='490' />
        <line x1='620' y1='550' x2='620' y2='510' />
        <line x1='700' y1='540' x2='700' y2='480' />
      </g>
      <g fill='var(--seed-neon)'>
        <circle cx='120' cy='486' r='3' />
        <circle cx='320' cy='492' r='3' />
        <circle cx='540' cy='486' r='3' />
        <circle cx='700' cy='476' r='3' />
      </g>
      <circle cx='640' cy='120' r='36' fill='var(--seed-amber)' />
      <g fill='var(--seed-fg)' opacity='0.7'>
        <circle cx='100' cy='110' r='1.4' />
        <circle cx='220' cy='80' r='1.2' />
        <circle cx='360' cy='140' r='1.6' />
        <circle cx='460' cy='60' r='1.2' />
        <circle cx='540' cy='220' r='1.6' />
      </g>
      <g
        fontFamily='ui-monospace, monospace'
        fontSize='12'
        fill='var(--seed-fg)'
        letterSpacing='3'
      >
        <text x='60' y='60'>
          THE HUMAN EDGE
        </text>
      </g>
      <text
        x='60'
        y='430'
        fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
        fontWeight='500'
        fontSize='76'
        fill='var(--seed-fg)'
        letterSpacing='-2'
      >
        the human
      </text>
      <text
        x='60'
        y='495'
        fontFamily='"Helvetica Neue", Inter, system-ui, sans-serif'
        fontWeight='300'
        fontStyle='italic'
        fontSize='46'
        fill='var(--seed-amber)'
        letterSpacing='-1'
      >
        edge.
      </text>
    </svg>
  );
}
