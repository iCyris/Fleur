import type { CSSProperties, ReactNode } from 'react';

export type StickerVariantId =
  | 'afu'
  | 'mon'
  | 'yuzi'
  | 'zell'
  | 'dot'
  | 'asterisk'
  | 'slash'
  | 'eye'
  | 'square'
  | 'tag'
  | 'moon';

export interface StickerRenderCallbacks {
  onLoad?: () => void;
  onError?: () => void;
}

export interface StickerVariant {
  id: StickerVariantId;
  size: [number, number];
  spinRange: [number, number];
  render: (color: string, callbacks?: StickerRenderCallbacks) => ReactNode;
}

const lavender = 'var(--seed-lavender)';
const amber = 'var(--seed-amber)';
const neon = 'var(--seed-neon)';
const ivory = 'var(--seed-fg)';
const ocean = 'var(--seed-ocean)';

const photoStickerImgStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  display: 'block',
  pointerEvents: 'none',
  userSelect: 'none',
  filter: 'url(#sticker-cut) drop-shadow(0 6px 12px rgba(0,0,0,0.42))',
};

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.currentTarget as HTMLImageElement).style.display = 'none';
}

export function StickerOutlineDefs() {
  return (
    <svg
      width='0'
      height='0'
      aria-hidden
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <filter
          id='sticker-cut'
          x='-10%'
          y='-10%'
          width='120%'
          height='120%'
          colorInterpolationFilters='sRGB'
        >
          <feMorphology
            in='SourceAlpha'
            operator='dilate'
            radius='1.2'
            result='outline'
          />
          <feColorMatrix
            in='outline'
            type='matrix'
            values='0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 1 0'
            result='whiteOutline'
          />
          <feMerge>
            <feMergeNode in='whiteOutline' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

export const STICKER_VARIANTS: StickerVariant[] = [
  {
    id: 'afu',
    size: [60, 108],
    spinRange: [-10, 10],
    render: (_, callbacks) => (
      <img
        src={`${import.meta.env.BASE_URL}stickers/Afu.png`}
        alt=''
        draggable={false}
        decoding='async'
        style={photoStickerImgStyle}
        onLoad={callbacks?.onLoad}
        onError={(e) => { hideOnError(e); callbacks?.onError?.(); }}
      />
    ),
  },
  {
    id: 'mon',
    size: [56, 100],
    spinRange: [-12, 12],
    render: (_, callbacks) => (
      <img
        src={`${import.meta.env.BASE_URL}stickers/Mon.png`}
        alt=''
        draggable={false}
        decoding='async'
        style={photoStickerImgStyle}
        onLoad={callbacks?.onLoad}
        onError={(e) => { hideOnError(e); callbacks?.onError?.(); }}
      />
    ),
  },
  {
    id: 'yuzi',
    size: [60, 108],
    spinRange: [-10, 10],
    render: (_, callbacks) => (
      <img
        src={`${import.meta.env.BASE_URL}stickers/Yuzi.png`}
        alt=''
        draggable={false}
        decoding='async'
        style={photoStickerImgStyle}
        onLoad={callbacks?.onLoad}
        onError={(e) => { hideOnError(e); callbacks?.onError?.(); }}
      />
    ),
  },
  {
    id: 'zell',
    size: [58, 104],
    spinRange: [-11, 11],
    render: (_, callbacks) => (
      <img
        src={`${import.meta.env.BASE_URL}stickers/Zell.png`}
        alt=''
        draggable={false}
        decoding='async'
        style={photoStickerImgStyle}
        onLoad={callbacks?.onLoad}
        onError={(e) => { hideOnError(e); callbacks?.onError?.(); }}
      />
    ),
  },
  {
    id: 'dot',
    size: [36, 36],
    spinRange: [-20, 20],
    render: () => (
      <svg viewBox='0 0 100 100' width='100%' height='100%'>
        <circle cx='50' cy='50' r='40' fill='none' stroke={ivory} strokeOpacity='0.18' strokeWidth='0.8' />
        <circle cx='50' cy='50' r='24' fill='none' stroke={lavender} strokeOpacity='0.3' strokeWidth='0.6' />
        <circle cx='50' cy='50' r='8' fill={amber} fillOpacity='0.85' />
      </svg>
    ),
  },
  {
    id: 'asterisk',
    size: [32, 32],
    spinRange: [-30, 30],
    render: () => (
      <svg viewBox='0 0 100 100' width='100%' height='100%'>
        <g stroke={lavender} strokeOpacity='0.5' strokeWidth='0.8' strokeLinecap='round'>
          <line x1='50' y1='18' x2='50' y2='82' />
          <line x1='18' y1='50' x2='82' y2='50' />
          <line x1='27' y1='27' x2='73' y2='73' />
          <line x1='27' y1='73' x2='73' y2='27' />
        </g>
        <circle cx='50' cy='50' r='3' fill={amber} fillOpacity='0.7' />
      </svg>
    ),
  },
  {
    id: 'slash',
    size: [56, 110],
    spinRange: [-8, 8],
    render: () => (
      <svg viewBox='0 0 140 100' width='100%' height='100%'>
        <rect x='2' y='2' width='136' height='96' rx='4' fill={ocean} fillOpacity='0.4' stroke={lavender} strokeOpacity='0.6' />
        <text x='14' y='44' fontFamily='ui-monospace, monospace' fontSize='14' fill={ivory} letterSpacing='0.04em'>// MEMORY</text>
        <text x='14' y='68' fontFamily='ui-monospace, monospace' fontSize='11' fill={ivory} fillOpacity='0.6' letterSpacing='0.08em'>FRAG_07 · 23:48</text>
        <line x1='14' y1='80' x2='126' y2='80' stroke={amber} strokeWidth='2' />
      </svg>
    ),
  },
  {
    id: 'eye',
    size: [38, 24],
    spinRange: [-10, 10],
    render: () => (
      <svg viewBox='0 0 120 80' width='100%' height='100%'>
        <path d='M10 40 Q60 10 110 40 Q60 70 10 40 Z' fill='none' stroke={ivory} strokeOpacity='0.25' strokeWidth='0.8' />
        <circle cx='60' cy='40' r='10' fill={lavender} fillOpacity='0.45' />
        <circle cx='62' cy='38' r='2.5' fill={ivory} fillOpacity='0.6' />
      </svg>
    ),
  },
  {
    id: 'square',
    size: [28, 28],
    spinRange: [-25, 25],
    render: () => (
      <svg viewBox='0 0 100 100' width='100%' height='100%'>
        <rect x='14' y='14' width='72' height='72' rx='2' fill='none' stroke={amber} strokeOpacity='0.3' strokeWidth='0.8' />
        <rect x='30' y='30' width='40' height='40' rx='1' fill={amber} fillOpacity='0.12' />
      </svg>
    ),
  },
  {
    id: 'tag',
    size: [70, 130],
    spinRange: [-10, 10],
    render: () => (
      <svg viewBox='0 0 160 60' width='100%' height='100%'>
        <rect x='2' y='2' width='156' height='56' rx='2' fill={ivory} fillOpacity='0.92' />
        <text x='14' y='24' fontFamily='ui-monospace, monospace' fontSize='11' fill={ocean} letterSpacing='0.12em'>CYRIS · 2026</text>
        <text x='14' y='44' fontFamily='ui-monospace, monospace' fontSize='11' fill={ocean} fillOpacity='0.6' letterSpacing='0.08em'>∞ summer night</text>
        <circle cx='148' cy='30' r='4' fill={amber} />
      </svg>
    ),
  },
  {
    id: 'moon',
    size: [30, 30],
    spinRange: [-8, 8],
    render: () => (
      <svg viewBox='0 0 100 100' width='100%' height='100%'>
        <circle cx='50' cy='50' r='28' fill={amber} fillOpacity='0.2' />
        <circle cx='42' cy='42' r='28' fill='var(--seed-bg, #0B0A1E)' />
        <circle cx='56' cy='46' r='1.5' fill={ivory} fillOpacity='0.15' />
      </svg>
    ),
  },
];

export function pickVariant(seed: number): StickerVariant {
  return STICKER_VARIANTS[seed % STICKER_VARIANTS.length];
}
