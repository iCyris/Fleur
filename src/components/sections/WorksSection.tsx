import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type MotionValue,
} from 'framer-motion';
import SectionLabel from '../SectionLabel';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import AdaptivePoster from '../works/AdaptivePoster';
import DesignPrinciplesPoster from '../works/DesignPrinciplesPoster';
import HumanEdgePoster from '../works/HumanEdgePoster';
import {
  contentGroupVariants,
  contentItemVariants,
  motionEase,
  viewportOnce,
} from '../../lib/motion';
import './WorksSection.css';

interface WorkItem {
  term: string;
  desc: string;
}

interface Work {
  index: string;
  title: string;
  items: WorkItem[];
  Poster: React.FC<{ reduced: boolean }>;
}

const WORKS: Work[] = [
  {
    index: '001',
    title: 'Good AI Product',
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
    Poster: AdaptivePoster,
  },
  {
    index: '002',
    title: 'Good Design Principles',
    items: [
      { term: 'Simplicity', desc: 'simple surface, deep power.' },
      { term: 'Trust', desc: 'earned by design, not assumed by default.' },
      { term: 'Craft', desc: 'knowing what to leave out matters.' },
      { term: 'Speed', desc: 'responsiveness shapes perception.' },
    ],
    Poster: DesignPrinciplesPoster,
  },
  {
    index: '003',
    title: 'The Human Edge',
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
    Poster: HumanEdgePoster,
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
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaInView = useInView(mediaRef, { once: true, margin: '-12% 0px -12% 0px' });
  const start = cardIndex / total;
  const end = (cardIndex + 1) / total;

  const imageY = useTransform(
    progress,
    [start - 0.1, end + 0.1],
    ['6%', '-6%'],
  );
  const captionY = useTransform(
    progress,
    [start - 0.1, end + 0.1],
    ['-3%', '4%'],
  );

  const Poster = work.Poster;

  return (
    <li className='works__card'>
      <motion.div
        ref={mediaRef}
        className='works__media'
        style={reduced ? undefined : { y: imageY }}
        initial={reduced ? false : { opacity: 0.38, scale: 0.965 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.08, ease: motionEase }}
      >
        <motion.div
          className='works__media-inner'
        >
          {(reduced || mediaInView) && <Poster reduced={reduced} />}
          <div className='works__media-grid fleur-grid-faint' aria-hidden />
        </motion.div>
        <div className='works__index mono-caps'>N°{work.index}</div>
      </motion.div>

      <motion.div
        className='works__caption'
        style={reduced ? undefined : { y: captionY }}
      >
        <motion.div
          className='works__caption-inner'
          initial={reduced ? false : { opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.82, delay: 0.08, ease: motionEase }}
        >
          <motion.h3 initial={reduced ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewportOnce} transition={{ duration: 0.62, delay: 0.24 }} className='works__title'>{work.title}</motion.h3>
          <motion.ul
            variants={contentGroupVariants}
            initial={reduced ? false : 'hidden'}
            whileInView='visible'
            viewport={viewportOnce}
            className='works__blurb'
          >
            {work.items.map((item) => (
              <motion.li variants={contentItemVariants} key={item.term}>
                <strong>{item.term}:</strong> {item.desc}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
    </li>
  );
}
