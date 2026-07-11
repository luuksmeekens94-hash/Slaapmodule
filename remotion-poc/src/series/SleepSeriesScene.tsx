import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import seriesTiming from '../../series-timing.json';

export type SeriesKind =
  | 'worry'
  | 'breathe'
  | 'cycles'
  | 'nightwake'
  | 'nightphrase'
  | 'clock'
  | 'sun'
  | 'lighttiming'
  | 'rhythm'
  | 'night'
  | 'pressure'
  | 'thought'
  | 'factcheck'
  | 'meter'
  | 'curve'
  | 'plan'
  | 'signalaction';

type SeriesConfig = {
  endLine1: string;
  endLine2: string;
  cameraOrigin: string;
  tone: 'night' | 'dawn' | 'day';
};

export const SERIES_CONFIG: Record<SeriesKind, SeriesConfig> = {
  worry: {
    endLine1: 'Piekeren mag op papier.',
    endLine2: 'Niet mee naar bed.',
    cameraOrigin: '36% 54%',
    tone: 'night',
  },
  breathe: {
    endLine1: 'Adem rustig in.',
    endLine2: 'En iets langer uit.',
    cameraOrigin: '54% 54%',
    tone: 'night',
  },
  cycles: {
    endLine1: 'Kort wakker worden is normaal.',
    endLine2: 'Het is niet meteen misgaan.',
    cameraOrigin: '66% 52%',
    tone: 'night',
  },
  nightwake: {
    endLine1: 'Lang wakker? Ga er even uit.',
    endLine2: 'Terug als je slaperig wordt.',
    cameraOrigin: '62% 52%',
    tone: 'night',
  },
  nightphrase: {
    endLine1: 'Je hoeft dit moment',
    endLine2: 'niet op te lossen.',
    cameraOrigin: '58% 52%',
    tone: 'night',
  },
  clock: {
    endLine1: 'Een vaste opsta-tijd',
    endLine2: 'geeft je slaapklok houvast.',
    cameraOrigin: '68% 44%',
    tone: 'dawn',
  },
  sun: {
    endLine1: 'Ochtendlicht zet je dag aan.',
    endLine2: 'Zo krijgt je ritme houvast.',
    cameraOrigin: '62% 42%',
    tone: 'dawn',
  },
  lighttiming: {
    endLine1: 'Helder in de ochtend.',
    endLine2: 'Zachter in de avond.',
    cameraOrigin: '54% 46%',
    tone: 'dawn',
  },
  rhythm: {
    endLine1: 'Maak tijd in bed passend.',
    endLine2: 'Bouw daarna rustig uit.',
    cameraOrigin: '54% 58%',
    tone: 'night',
  },
  night: {
    endLine1: 'Korter in bed kan tijdelijk helpen.',
    endLine2: 'Doe dit samen met je fysio.',
    cameraOrigin: '64% 52%',
    tone: 'night',
  },
  pressure: {
    endLine1: 'Wakker zijn bouwt slaapdruk op.',
    endLine2: 'Dutjes halen er iets vanaf.',
    cameraOrigin: '50% 48%',
    tone: 'day',
  },
  thought: {
    endLine1: 'Een gedachte is geen feit.',
    endLine2: 'Maak haar eerlijker en helpender.',
    cameraOrigin: '38% 56%',
    tone: 'night',
  },
  factcheck: {
    endLine1: 'Feit of voorspelling?',
    endLine2: 'Eerst toetsen, dan bijsturen.',
    cameraOrigin: '48% 54%',
    tone: 'night',
  },
  meter: {
    endLine1: 'Gedachten sturen je alarm.',
    endLine2: 'Een helpende zin kan het laten zakken.',
    cameraOrigin: '54% 50%',
    tone: 'night',
  },
  curve: {
    endLine1: 'Een slechte nacht is geen mislukking.',
    endLine2: 'Ga terug naar je basis.',
    cameraOrigin: '58% 48%',
    tone: 'dawn',
  },
  plan: {
    endLine1: 'Signaal gezien? Kies één actie.',
    endLine2: 'Je plan ligt al klaar.',
    cameraOrigin: '42% 54%',
    tone: 'night',
  },
  signalaction: {
    endLine1: 'Eén herkenbaar signaal.',
    endLine2: 'Eén vooraf gekozen actie.',
    cameraOrigin: '54% 54%',
    tone: 'night',
  },
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const phase = (frame: number, from: number, to: number) => smooth((frame - from) / (to - from));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

type Cue = {start: number; end: number; text: string};
type TimingData = {videos: Partial<Record<SeriesKind, {durationSeconds: number; audioFile: string; captionFile: string; cues: Cue[]}>>};
type CueState = {index: number; progress: number; cues: Cue[]};
const timingData = seriesTiming as TimingData;

const cueStateFor = (kind: SeriesKind, seconds: number, durationInFrames: number): CueState => {
  const configured = timingData.videos[kind]?.cues;
  const cues = configured?.length
    ? configured
    : Array.from({length: kind === 'breathe' ? 7 : 5}, (_, index) => ({
        start: (durationInFrames / 30 - 5) * index / (kind === 'breathe' ? 7 : 5),
        end: (durationInFrames / 30 - 5) * (index + 1) / (kind === 'breathe' ? 7 : 5),
        text: '',
      }));
  let index = cues.findIndex((cue) => seconds <= cue.end);
  if (index < 0) index = cues.length - 1;
  const cue = cues[index];
  return {index, progress: smooth((seconds - cue.start) / Math.max(0.001, cue.end - cue.start)), cues};
};

const revealAtCue = (state: CueState, target: number) =>
  state.index < target ? 0 : state.index > target ? 1 : state.progress;

const Person = ({
  x,
  y,
  scale = 1,
  seated = false,
  eyesClosed = false,
  calm = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  seated?: boolean;
  eyesClosed?: boolean;
  calm?: number;
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="112" rx="76" ry="24" fill="#071126" opacity=".28" />
    <path
      d={seated ? 'M-58 34 Q0 0 58 34 L76 126 H-78Z' : 'M-68 38 Q0 4 68 38 L88 162 H-88Z'}
      fill="#2E6C8B"
    />
    <path d="M-44 44 Q0 26 44 44" fill="none" stroke="#9FE3E3" strokeWidth="8" opacity={0.18 + calm * 0.26} />
    <circle cx="0" cy="-26" r="58" fill="#E5A57E" />
    <path d="M-57 -27 Q-46 -90 18 -88 Q65 -76 58 -18 Q32 -48 -8 -42 Q-34 -42 -57 -27" fill="#17213A" />
    <path d="M-33 -20 Q-19 -25 -6 -20" fill="none" stroke="#17213A" strokeWidth="6" strokeLinecap="round" />
    <path d="M8 -20 Q22 -25 35 -20" fill="none" stroke="#17213A" strokeWidth="6" strokeLinecap="round" />
    {eyesClosed || calm > 0.7 ? (
      <>
        <path d="M-34 -8 Q-20 2 -6 -8" fill="none" stroke="#27334B" strokeWidth="5" strokeLinecap="round" />
        <path d="M8 -8 Q22 2 36 -8" fill="none" stroke="#27334B" strokeWidth="5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <ellipse cx="-20" cy="-7" rx="6" ry="8" fill="#17213A" />
        <ellipse cx="22" cy="-7" rx="6" ry="8" fill="#17213A" />
      </>
    )}
    <path d={`M-12 18 Q0 ${24 + calm * 8} 14 18`} fill="none" stroke="#914F4A" strokeWidth="5" strokeLinecap="round" />
    {seated && (
      <>
        <path d="M-58 78 Q-112 106 -108 160" fill="none" stroke="#E5A57E" strokeWidth="24" strokeLinecap="round" />
        <path d="M58 78 Q112 106 108 160" fill="none" stroke="#E5A57E" strokeWidth="24" strokeLinecap="round" />
      </>
    )}
  </g>
);

const Bed = ({
  x = 980,
  y = 650,
  asleep = false,
  glow = 0,
  personOpacity = 1,
}: {
  x?: number;
  y?: number;
  asleep?: boolean;
  glow?: number;
  personOpacity?: number;
}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="245" rx="540" ry="62" fill="#061126" opacity=".3" />
    <rect x="-500" y="50" width="1000" height="220" rx="54" fill="#1E4C70" />
    <path d="M-500 86 Q-200 8 76 92 T500 88 V270 H-500Z" fill="#347A99" />
    <path d="M-466 92 Q-210 28 40 100" fill="none" stroke="#9FE3E3" strokeWidth="16" opacity={0.12 + glow * 0.24} />
    <rect x="210" y="-12" width="234" height="128" rx="58" fill="#C9E1E9" />
    <g transform="translate(220 12) rotate(7)" opacity={personOpacity}>
      <circle cx="0" cy="0" r="50" fill="#E5A57E" />
      <path d="M-49 0 Q-44 -60 12 -62 Q52 -53 51 -5 Q18 -30 -18 -26Z" fill="#17213A" />
      {asleep ? (
        <path d="M-26 5 Q-12 14 2 5 M16 6 Q28 14 40 5" fill="none" stroke="#27334B" strokeWidth="5" strokeLinecap="round" />
      ) : (
        <ellipse cx="13" cy="6" rx="6" ry="8" fill="#17213A" />
      )}
    </g>
  </g>
);

const Window = ({x = 240, y = 100, dawn = 0}: {x?: number; y?: number; dawn?: number}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width="420" height="360" rx="22" fill={dawn > 0.5 ? '#F9C97A' : '#0A1732'} stroke="#7299B0" strokeWidth="12" />
    <rect x="20" y="20" width="380" height="320" rx="12" fill={dawn > 0.5 ? '#F6D8A4' : '#10264E'} />
    <path d="M210 20V340 M20 180H400" stroke="#8DB4C5" strokeWidth="10" />
    <circle cx={dawn > 0.5 ? 104 : 310} cy={dawn > 0.5 ? 104 : 92} r={dawn > 0.5 ? 58 : 42} fill={dawn > 0.5 ? '#FFB84C' : '#EAF3F4'} opacity=".92" />
    {dawn <= 0.5 && [70, 134, 270, 348].map((cx, i) => <circle key={cx} cx={cx} cy={70 + (i % 2) * 65} r="5" fill="#EAF3F4" opacity=".72" />)}
  </g>
);

const Paper = ({x, y, lines = 3, checked = 0}: {x: number; y: number; lines?: number; checked?: number}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0 Q170 -14 330 8 L315 250 Q158 270 4 246Z" fill="#F4EEE1" stroke="#C8BFAE" strokeWidth="6" />
    {Array.from({length: lines}).map((_, i) => (
      <g key={i}>
        <circle cx="52" cy={60 + i * 55} r="13" fill={i < checked ? '#66C8C5' : 'none'} stroke="#2F6F87" strokeWidth="5" />
        {i < checked && <path d={`M43 ${60 + i * 55} l8 8 16 -20`} fill="none" stroke="#F5FBFB" strokeWidth="5" strokeLinecap="round" />}
        <path d={`M82 ${60 + i * 55} H270`} stroke="#6F7C83" strokeWidth="7" strokeLinecap="round" opacity=".55" />
      </g>
    ))}
  </g>
);

const Scribble = ({x, y, opacity = 1}: {x: number; y: number; opacity?: number}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <path d="M8 74 C-32 8 76 -18 104 36 C132 -28 230 -5 208 70 C282 48 296 146 234 158 C262 230 154 246 126 190 C68 246 -16 197 18 145 C-48 120 -36 50 8 74Z" fill="#743B55" opacity=".48" />
    <path d="M20 100 C70 32 120 190 184 72 C220 22 242 140 196 168 C128 210 92 40 38 160" fill="none" stroke="#F0A4A5" strokeWidth="10" strokeLinecap="round" />
  </g>
);

const Desk = ({x = 180, y = 660}: {x?: number; y?: number}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0 H590 L630 56 H-38Z" fill="#8A5D4A" />
    <path d="M10 55 H580 V295 H520 V92 H70 V295 H10Z" fill="#604236" />
  </g>
);

const ClockFace = ({x, y, hour = 7, glow = 0}: {x: number; y: number; hour?: number; glow?: number}) => {
  const angle = (hour % 12) * 30;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={112 + glow * 16} fill="#FFF5D8" opacity={0.12 + glow * 0.12} />
      <circle r="92" fill="#F5F0E6" stroke="#254464" strokeWidth="10" />
      <path d="M0 0 V-50" stroke="#17304F" strokeWidth="10" strokeLinecap="round" transform={`rotate(${angle})`} />
      <path d="M0 0 V-66" stroke="#17304F" strokeWidth="7" strokeLinecap="round" transform="rotate(0)" />
      <circle r="10" fill="#17304F" />
    </g>
  );
};

const Background = ({tone}: {tone: SeriesConfig['tone']}) => {
  const wall = tone === 'day' ? 'url(#dayWall)' : tone === 'dawn' ? 'url(#dawnWall)' : 'url(#nightWall)';
  return (
    <>
      <rect width="1920" height="1080" fill={wall} />
      <rect y="760" width="1920" height="320" fill={tone === 'day' ? '#C9D9D4' : '#10243E'} />
      <rect width="1920" height="1080" filter="url(#texture)" opacity=".25" />
    </>
  );
};

const Definitions = () => (
  <defs>
    <linearGradient id="nightWall" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#08152C" />
      <stop offset=".55" stopColor="#19365F" />
      <stop offset="1" stopColor="#315675" />
    </linearGradient>
    <linearGradient id="dawnWall" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#284A68" />
      <stop offset=".55" stopColor="#8AA6AF" />
      <stop offset="1" stopColor="#E8B77D" />
    </linearGradient>
    <linearGradient id="dayWall" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#CBE5E0" />
      <stop offset=".58" stopColor="#F1E2C8" />
      <stop offset="1" stopColor="#E8BC7E" />
    </linearGradient>
    <radialGradient id="aura">
      <stop offset="0" stopColor="#86E0DC" stopOpacity=".62" />
      <stop offset="1" stopColor="#86E0DC" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="alertAura">
      <stop offset="0" stopColor="#ED8D82" stopOpacity=".58" />
      <stop offset="1" stopColor="#ED8D82" stopOpacity="0" />
    </radialGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="18" /></filter>
    <filter id="soft"><feGaussianBlur stdDeviation="8" /></filter>
    <filter id="texture" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="19" />
      <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .05 0" />
    </filter>
  </defs>
);

const WorryVisual = ({state}: {state: CueState}) => {
  const bedOpacity = state.index < 2 ? 1 : state.index > 2 ? 0 : 1 - smooth(state.progress / 0.28);
  const desk = state.index < 2 ? 0 : state.index > 2 ? 1 : smooth((state.progress - 0.22) / 0.28);
  const write = revealAtCue(state, 2);
  const park = revealAtCue(state, 4);
  return (
    <>
      <Window x={1390} y={100} />
      <g opacity={bedOpacity}>
        <Bed x={830} y={650} asleep={false} />
        <Scribble x={410} y={160} opacity={1 - desk} />
      </g>
      <g opacity={desk}>
        <Desk x={170} y={670} />
        <Person x={430} y={510} scale={1.08} seated calm={park} />
        <Scribble x={250} y={170} opacity={1 - park} />
        <g transform={`translate(${230 + park * 650} ${660 - park * 40}) rotate(${write * 2 - park * 4})`}>
          <Paper x={0} y={0} lines={3} checked={Math.round(write * 2)} />
          <path d={`M110 105 Q${150 + write * 60} ${80 + write * 50} 248 115`} stroke="#254464" strokeWidth="8" fill="none" strokeLinecap="round" />
        </g>
        <g transform="translate(1120 720)">
          <rect width="420" height="220" rx="28" fill="#7A5542" />
          <path d="M-20 22 H440" stroke="#A8795E" strokeWidth="28" strokeLinecap="round" />
          <text x="210" y="142" textAnchor="middle" fill="#E9CDB5" fontSize="32" fontWeight="700" letterSpacing="5">MORGEN</text>
        </g>
      </g>
    </>
  );
};

const BreatheVisual = ({state}: {state: CueState}) => {
  const inhale = state.index === 1 || state.index === 4;
  const exhale = state.index === 2 || state.index === 5;
  const breath = inhale ? state.progress : exhale ? 1 - state.progress : 0;
  const ring = 150 + breath * 120;
  const label = inhale ? 'RUSTIG IN' : exhale ? 'LANGER UIT' : state.index === 3 ? 'NOG EEN KEER' : 'ADEM RUSTIG';
  return (
    <>
      <Window x={180} y={120} />
      <circle cx="1040" cy="500" r={ring + 76} fill="url(#aura)" opacity=".34" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="1040" cy="500" r={ring + i * 38} fill="none" stroke="#8ADBD7" strokeWidth={12 - i * 2} opacity={0.46 - i * 0.1} />
      ))}
      <Person x={1040} y={510} scale={1.35} seated eyesClosed calm={1} />
      <text x="1040" y="930" textAnchor="middle" fill="#E8F4F2" fontSize="52" fontWeight="600" letterSpacing="8">
        {label}
      </text>
    </>
  );
};

const CyclesVisual = ({state, frame}: {state: CueState; frame: number}) => {
  const settleFirst = state.index === 2 ? state.progress : state.index > 2 ? 1 : 0;
  const checking = state.index === 3 ? Math.sin(state.progress * Math.PI) : 0;
  const finalSettle = revealAtCue(state, 4);
  const awake = state.index < 2 ? 1 : state.index === 2 ? 1 - settleFirst : checking > 0.05 ? 1 : 1 - finalSettle;
  const offset = frame * 2.2;
  return (
    <>
      <Window x={170} y={105} />
      <Bed x={1030} y={630} asleep={awake < 0.35} glow={Math.max(settleFirst, finalSettle)} />
      <g opacity=".76">
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${-240 + ((offset + i * 610) % 2100)} ${310 + i * 70} C${100 + ((offset + i * 610) % 2100)} ${210 + i * 70} ${340 + ((offset + i * 610) % 2100)} ${420 + i * 70} ${700 + ((offset + i * 610) % 2100)} ${315 + i * 70}`}
            fill="none"
            stroke={i === 1 ? '#82DDD8' : '#8BB6D4'}
            strokeWidth="18"
            strokeLinecap="round"
            opacity={0.55 - i * 0.08}
          />
        ))}
      </g>
      <Scribble x={1260} y={330} opacity={checking * 0.8} />
      <ClockFace x={1540} y={240} hour={3} glow={checking} />
    </>
  );
};

const NightWakeVisual = ({state}: {state: CueState}) => {
  const leaveBed = state.index < 2 ? 1 : state.index > 2 ? 0 : 1 - smooth(state.progress / 0.28);
  const enterChair = state.index < 2 ? 0 : state.index > 2 ? 1 : smooth((state.progress - 0.22) / 0.3);
  const returnBed = state.index < 3 ? 0 : state.index > 3 ? 1 : smooth((state.progress - 0.55) / 0.25);
  const leaveChair = state.index === 3 ? smooth((state.progress - 0.48) / 0.25) : state.index > 3 ? 1 : 0;
  const chairOpacity = enterChair * (1 - leaveChair);
  const bedOpacity = state.index < 3 ? leaveBed : returnBed;
  return (
    <>
      <Window x={170} y={100} />
      <Bed x={1080} y={640} asleep={returnBed > 0.7} glow={returnBed} personOpacity={bedOpacity} />
      <g opacity={chairOpacity} transform={`translate(${mix(100, 0, chairOpacity)} 0)`}>
        <ellipse cx="1390" cy="850" rx="250" ry="48" fill="#061126" opacity=".28" />
        <path d="M1220 690 Q1390 610 1550 700 L1515 920 H1250Z" fill="#315F78" />
        <Person x={1385} y={630} scale={1.12} seated eyesClosed calm={returnBed} />
        <circle cx="1640" cy="590" r="120" fill="#F4C477" opacity=".18" filter="url(#glow)" />
        <path d="M1600 650 H1690 L1650 500Z" fill="#E6B765" />
      </g>
      <ClockFace x={1550} y={210} hour={3} glow={0.2} />
    </>
  );
};

const ClockVisual = ({state}: {state: CueState}) => {
  const dawn = revealAtCue(state, 1);
  const repeat = revealAtCue(state, 2);
  const variation = state.index === 3 ? Math.sin(state.progress * Math.PI) : 0;
  const anchor = revealAtCue(state, 4);
  return (
    <>
      <Window x={210} y={95} dawn={dawn} />
      <ClockFace x={1260} y={360} hour={7 + variation * 2} glow={Math.max(dawn, anchor)} />
      <Person x={1260} y={650} scale={1.25} seated calm={anchor} />
      {[0, 1, 2].map((i) => {
        const shift = (i - 1) * variation * 28 * (1 - anchor);
        return (
          <g key={i} transform={`translate(${720 + i * 185} ${870 + shift})`} opacity={0.28 + repeat * 0.52}>
            <path d="M0 0 Q70 -18 140 0 L132 118 Q70 132 4 116Z" fill="#F1E8D6" />
            <text x="70" y="46" textAnchor="middle" fill="#39566A" fontSize="24" fontWeight="700">DAG {i + 1}</text>
            <circle cx="70" cy="83" r="16" fill={variation > 0.1 ? '#E28A66' : '#F2A94F'} />
          </g>
        );
      })}
    </>
  );
};

const SunVisual = ({frame}: {frame: number}) => {
  const light = phase(frame, 95, 320);
  const evening = phase(frame, 420, 610);
  return (
    <>
      <Window x={180} y={90} dawn={light} />
      <path d={`M560 120 L${1200 + light * 220} 760 L720 760Z`} fill="#FFE3A6" opacity={0.1 + light * 0.28} />
      <Person x={1240} y={610} scale={1.3} seated calm={light} />
      <circle cx="1240" cy="520" r={100 + light * 100} fill="#FFE0A0" opacity={light * 0.18} filter="url(#glow)" />
      <g opacity={evening}>
        <circle cx="1625" cy="260" r="78" fill="#263C63" />
        <path d="M1592 250 Q1610 270 1630 250 M1642 250 Q1660 270 1678 250" fill="none" stroke="#D9E7EA" strokeWidth="8" strokeLinecap="round" />
      </g>
    </>
  );
};

const RhythmVisual = ({frame}: {frame: number}) => {
  const fit = phase(frame, 170, 390);
  const expand = phase(frame, 450, 610);
  const left = mix(250, 520, fit) - expand * 60;
  const right = mix(1680, 1410, fit) + expand * 60;
  return (
    <>
      <Window x={160} y={95} />
      <Bed x={1050} y={650} asleep glow={fit} />
      <path d={`M${left} 815 H${right}`} stroke="#8DD8D5" strokeWidth="20" strokeLinecap="round" />
      <circle cx={left} cy="815" r="28" fill="#E9B565" />
      <circle cx={right} cy="815" r="28" fill="#E9B565" />
      <text x={(left + right) / 2} y="915" textAnchor="middle" fill="#D9ECEB" fontSize="42" fontWeight="600">
        {expand > 0.4 ? 'RUSTIG UITBOUWEN' : fit > 0.5 ? 'PASSEND BIJ JE SLAAP' : 'TE VEEL WAKKER IN BED'}
      </text>
    </>
  );
};

const NightVisual = ({state}: {state: CueState}) => {
  const anchor = revealAtCue(state, 2);
  const guide = revealAtCue(state, 3);
  const settle = revealAtCue(state, 4);
  return (
    <>
      <Window x={160} y={90} dawn={anchor} />
      <ClockFace x={560} y={330} hour={anchor > 0.5 ? 7 : 1} glow={anchor} />
      <Bed x={1130} y={650} asleep={anchor > 0.6} glow={Math.max(anchor, settle)} />
      <path d="M440 820 H1540" stroke="#8DD8D5" strokeWidth="18" strokeLinecap="round" opacity={anchor * 0.7} />
      <circle cx={mix(1420, 760, anchor)} cy="820" r="24" fill="#E9B565" />
      <g opacity={guide} transform="translate(1650 320)">
        <circle r="92" fill="#EAF2E9" />
        <path d="M-42 8 Q0 34 42 8" fill="none" stroke="#4B7890" strokeWidth="10" strokeLinecap="round" />
        <circle cx="-24" cy="-22" r="7" fill="#27435F" /><circle cx="24" cy="-22" r="7" fill="#27435F" />
        <text x="0" y="132" textAnchor="middle" fill="#D9ECEB" fontSize="25" fontWeight="700" letterSpacing="3">FYSIO</text>
      </g>
    </>
  );
};

const PressureVisual = ({state}: {state: CueState}) => {
  const build = state.index < 2 ? (state.index + state.progress) / 2 : 1;
  const shortNap = state.index === 3 ? Math.sin(state.progress * Math.PI) : 0;
  const recover = revealAtCue(state, 4);
  const pressure = state.index < 2
    ? build
    : state.index === 2
      ? mix(1, 0.25, smooth(state.progress * 1.8))
      : state.index === 3
        ? 0.65 - shortNap * 0.15
        : mix(0.65, 1, recover);
  const nap = Math.max(state.index === 2 ? 1 : 0, shortNap);
  return (
    <>
      <circle cx="360" cy="215" r="92" fill="#F3AD49" opacity=".95" />
      <path d="M0 760 Q450 610 920 760 T1920 720 V1080 H0Z" fill="#6D9B82" />
      <Person x={940} y={610} scale={1.35} seated={nap > 0.35} eyesClosed={nap > 0.35} calm={recover} />
      <circle cx="940" cy="500" r={120 + pressure * 280} fill="url(#aura)" opacity={0.18 + pressure * 0.34} />
      <circle cx="940" cy="500" r={65 + pressure * 150} fill="#4CB6B4" opacity={0.22 + pressure * 0.46} filter="url(#soft)" />
      <g opacity={nap} transform="translate(1330 700)">
        <path d="M0 0 Q180 -50 340 20 V180 H0Z" fill="#E9D4A9" />
        <text x="170" y="112" textAnchor="middle" fill="#5B614F" fontSize="40" fontWeight="700">DUTJE</text>
      </g>
    </>
  );
};

const ThoughtVisual = ({frame}: {frame: number}) => {
  const write = phase(frame, 170, 360);
  const reframe = phase(frame, 380, 580);
  return (
    <>
      <Window x={155} y={100} />
      <Desk x={170} y={670} />
      <Person x={430} y={510} scale={1.08} seated calm={reframe} />
      <Scribble x={240} y={150} opacity={1 - reframe} />
      <g transform={`translate(880 ${510 - reframe * 45}) rotate(${(1 - reframe) * -3})`}>
        <Paper x={0} y={0} lines={2} checked={reframe > 0.55 ? 2 : Math.round(write)} />
        <text x="160" y="92" textAnchor="middle" fill={reframe > 0.4 ? '#2D6970' : '#8A4551'} fontSize="34" fontWeight="700">
          {reframe > 0.45 ? 'Dit wordt lastig — en ik kan bijsturen.' : 'Morgen lukt niets.'}
        </text>
      </g>
    </>
  );
};

const MeterVisual = ({state}: {state: CueState}) => {
  const alert = state.index === 0 ? 0.45 + state.progress * 0.55 : state.index < 3 ? 1 : 1 - revealAtCue(state, 3);
  const calm = revealAtCue(state, 3);
  return (
    <>
      <Window x={150} y={90} />
      <circle cx="980" cy="480" r={210 + alert * 120} fill="url(#alertAura)" opacity={alert * 0.8} />
      <circle cx="980" cy="480" r={180 + calm * 120} fill="url(#aura)" opacity={calm * 0.7} />
      <Person x={980} y={520} scale={1.5} seated calm={calm} />
      <g transform={`translate(1350 ${260 + calm * 300})`} opacity={0.4 + calm * 0.6}>
        <Paper x={0} y={0} lines={2} checked={calm > 0.55 ? 2 : 0} />
      </g>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${720 - i * 35} ${380 + i * 90} Q650 ${440 + i * 70} ${700 - i * 28} ${510 + i * 52}`} fill="none" stroke="#F09B93" strokeWidth="10" opacity={alert * 0.7} strokeLinecap="round" />
      ))}
    </>
  );
};

const CurveVisual = ({frame}: {frame: number}) => {
  const travel = phase(frame, 70, 620);
  const x = mix(210, 1660, travel);
  const y = 690 - Math.sin(travel * Math.PI * 3.2) * 120 - travel * 130;
  return (
    <>
      <circle cx="1590" cy="210" r="104" fill="#F3AD49" opacity={0.35 + travel * 0.55} />
      <path d="M0 820 Q260 640 500 760 T920 650 T1320 700 T1920 460 V1080 H0Z" fill="#426D71" />
      <path d="M100 800 Q280 650 500 755 T920 645 T1320 695 T1780 500" fill="none" stroke="#BCE1D4" strokeWidth="22" strokeLinecap="round" />
      <g transform={`translate(${x} ${y})`}>
        <circle cy="-54" r="38" fill="#E5A57E" />
        <path d="M-34 -56 Q-24 -100 18 -94 Q48 -85 40 -51Z" fill="#17213A" />
        <path d="M-42 -10 Q0 -35 42 -10 L58 96 H-58Z" fill="#2E6C8B" />
        <path d="M-24 85 l-28 70 M24 85 l34 70" stroke="#243D57" strokeWidth="18" strokeLinecap="round" />
      </g>
    </>
  );
};

const PlanVisual = ({frame}: {frame: number}) => {
  const rain = 1 - phase(frame, 430, 620);
  const checks = Math.round(phase(frame, 150, 540) * 4);
  return (
    <>
      <Window x={145} y={80} />
      <g opacity={rain * 0.65}>
        {Array.from({length: 13}).map((_, i) => (
          <path key={i} d={`M${170 + (i % 6) * 65} ${115 + (i % 4) * 70} l-22 46`} stroke="#B7D4E0" strokeWidth="6" strokeLinecap="round" />
        ))}
      </g>
      <Desk x={210} y={675} />
      <Person x={460} y={515} scale={1.08} seated calm={phase(frame, 400, 610)} />
      <g transform="translate(850 470) rotate(-2)"><Paper x={0} y={0} lines={4} checked={checks} /></g>
      <circle cx="1390" cy="560" r={100 + checks * 18} fill="url(#aura)" opacity={checks * 0.12} />
    </>
  );
};

const NightPhraseVisual = ({state}: {state: CueState}) => {
  const phrase = revealAtCue(state, 2);
  const calm = revealAtCue(state, 3);
  return (
    <>
      <Window x={160} y={95} />
      <Bed x={1050} y={650} asleep={false} glow={calm} />
      <circle cx="1120" cy="500" r={130 + calm * 170} fill="url(#aura)" opacity={calm * 0.34} />
      <g opacity={phrase} transform={`translate(${400 + phrase * 70} ${250 - phrase * 20})`}>
        <path d="M0 0 Q250 -32 500 0 L480 190 Q250 220 16 188Z" fill="#F3EEE2" opacity=".96" />
        <text x="250" y="82" textAnchor="middle" fill="#284B60" fontSize="36" fontWeight="600">Ik hoef dit moment</text>
        <text x="250" y="132" textAnchor="middle" fill="#284B60" fontSize="36" fontWeight="600">niet op te lossen.</text>
      </g>
    </>
  );
};

const LightTimingVisual = ({state}: {state: CueState}) => {
  const morning = revealAtCue(state, 1);
  const evening = revealAtCue(state, 3);
  return (
    <>
      <g opacity={1 - evening * 0.45}><Window x={190} y={95} dawn={morning} /></g>
      <path d={`M610 130 L${1180 + morning * 250} 760 L760 760Z`} fill="#FFE2A0" opacity={morning * (1 - evening) * 0.36} />
      <Person x={1050} y={620} scale={1.28} seated calm={morning} />
      <g opacity={evening}>
        <circle cx="1550" cy="300" r="118" fill="#F1C66E" opacity=".18" filter="url(#glow)" />
        <path d="M1500 650 H1620 L1580 410Z" fill="#D9A956" />
        <circle cx="1580" cy="410" r="58" fill="#F5D28A" />
        <text x="1510" y="840" textAnchor="middle" fill="#D9E9EA" fontSize="38" fontWeight="600">ZACHTER LICHT</text>
      </g>
    </>
  );
};

const FactCheckVisual = ({state}: {state: CueState}) => {
  const question = revealAtCue(state, 1);
  const fact = revealAtCue(state, 2);
  const prediction = revealAtCue(state, 3);
  const reframe = revealAtCue(state, 4);
  return (
    <>
      <Window x={150} y={95} />
      <Desk x={150} y={680} />
      <Person x={420} y={520} scale={1.08} seated calm={reframe} />
      <Scribble x={235} y={170} opacity={1 - reframe} />
      <g transform={`translate(760 ${430 - question * 25})`} opacity={0.35 + question * 0.65}>
        <Paper x={0} y={0} lines={2} checked={Math.round(fact)} />
        <text x="165" y="90" textAnchor="middle" fill="#2C6870" fontSize="33" fontWeight="800">FEIT</text>
      </g>
      <g transform={`translate(1240 ${430 - question * 25})`} opacity={0.35 + question * 0.65}>
        <Paper x={0} y={0} lines={2} checked={Math.round(prediction)} />
        <text x="165" y="90" textAnchor="middle" fill="#8A4551" fontSize="30" fontWeight="800">VOORSPELLING</text>
      </g>
      <path d="M1070 720 H1240" stroke="#8ADBD7" strokeWidth="14" strokeLinecap="round" opacity={reframe} />
    </>
  );
};

const SignalActionVisual = ({state}: {state: CueState}) => {
  const signal = revealAtCue(state, 1);
  const link = revealAtCue(state, 2);
  const action = revealAtCue(state, 3);
  const settle = revealAtCue(state, 4);
  return (
    <>
      <Window x={150} y={95} />
      <Bed x={700} y={650} asleep={false} glow={settle} />
      <ClockFace x={1460} y={260} hour={3} glow={signal} />
      <Scribble x={1120} y={220} opacity={signal * (1 - settle)} />
      <path d="M1180 570 C1320 520 1380 570 1460 650" fill="none" stroke="#8ADBD7" strokeWidth="18" strokeLinecap="round" opacity={link} />
      <path d="M1430 620 l42 32 -45 24" fill="none" stroke="#8ADBD7" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity={link} />
      <g opacity={action} transform="translate(1370 650)">
        <rect width="260" height="210" rx="26" fill="#315F78" />
        <circle cx="210" cy="105" r="18" fill="#F2C06D" />
        <text x="130" y="275" textAnchor="middle" fill="#D9E9EA" fontSize="34" fontWeight="600">EVEN UIT BED</text>
      </g>
    </>
  );
};

const Visual = ({kind, frame, state}: {kind: SeriesKind; frame: number; state: CueState}) => {
  switch (kind) {
    case 'worry': return <WorryVisual state={state} />;
    case 'breathe': return <BreatheVisual state={state} />;
    case 'cycles': return <CyclesVisual state={state} frame={frame} />;
    case 'nightwake': return <NightWakeVisual state={state} />;
    case 'nightphrase': return <NightPhraseVisual state={state} />;
    case 'clock': return <ClockVisual state={state} />;
    case 'sun': return <SunVisual frame={frame} />;
    case 'lighttiming': return <LightTimingVisual state={state} />;
    case 'rhythm': return <RhythmVisual frame={frame} />;
    case 'night': return <NightVisual state={state} />;
    case 'pressure': return <PressureVisual state={state} />;
    case 'thought': return <ThoughtVisual frame={frame} />;
    case 'factcheck': return <FactCheckVisual state={state} />;
    case 'meter': return <MeterVisual state={state} />;
    case 'curve': return <CurveVisual frame={frame} />;
    case 'plan': return <PlanVisual frame={frame} />;
    case 'signalaction': return <SignalActionVisual state={state} />;
  }
};

export const SleepSeriesScene: React.FC<{kind: SeriesKind}> = ({kind}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const state = cueStateFor(kind, frame / 30, durationInFrames);
  const visualFrame = state.index * 144 + state.progress * 144;
  const config = SERIES_CONFIG[kind];
  const audioFile = timingData.videos[kind]?.audioFile ?? `audio/${kind}-nono-v2.mp3`;
  const endStart = durationInFrames - 82;
  const sceneFade = phase(frame, endStart - 28, endStart + 8);
  const endText = phase(frame, endStart, endStart + 30);
  const push = phase(frame, Math.round(durationInFrames * 0.33), Math.round(durationInFrames * 0.62));
  const pull = phase(frame, Math.round(durationInFrames * 0.68), Math.round(durationInFrames * 0.86));
  const cameraScale = 1 + push * 0.018 - pull * 0.014;
  const cameraY = -6 * push + 5 * pull;

  return (
    <AbsoluteFill style={{background: '#08152C', fontFamily: 'Manrope, sans-serif', overflow: 'hidden'}}>
      <Sequence from={30}>
        <Audio src={staticFile(audioFile)} volume={1} />
      </Sequence>
      <AbsoluteFill
        style={{
          transform: `translateY(${cameraY}px) scale(${cameraScale})`,
          transformOrigin: config.cameraOrigin,
          opacity: 1 - sceneFade,
          willChange: 'transform',
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <Definitions />
          <Background tone={config.tone} />
          <Visual kind={kind} frame={visualFrame} state={state} />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill style={{background: '#08152C', opacity: sceneFade}} />
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: endText}}>
        <div
          style={{
            textAlign: 'center',
            color: '#F5F7F8',
            maxWidth: 1500,
            padding: '0 90px',
            transform: `translateY(${interpolate(endText, [0, 1], [12, 0])}px)`,
          }}
        >
          <div style={{fontSize: 62, lineHeight: 1.16, fontWeight: 600, letterSpacing: '-1.5px'}}>{config.endLine1}</div>
          <div style={{fontSize: 43, lineHeight: 1.3, fontWeight: 400, color: '#A8DADF', marginTop: 20}}>{config.endLine2}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
