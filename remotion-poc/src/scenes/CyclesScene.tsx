import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONT, NIGHT_BG } from '../shared/tokens';
import { Title, Caption, Vignette, Wordmark } from '../shared/Frame';

type Pt = readonly [number, number];
type Seg = readonly [Pt, Pt, Pt, Pt];

const SEGMENTS: readonly Seg[] = [
  [[64, 92],   [100, 92],  [116, 200], [168, 200]],
  [[168, 200], [220, 200], [224, 110], [268, 110]],
  [[268, 110], [312, 110], [318, 218], [368, 218]],
  [[368, 218], [418, 218], [420, 124], [458, 124]],
  [[458, 124], [490, 124], [500, 198], [516, 198]],
];
const bezier = (t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};
const pointAt = (progress: number): Pt => {
  const c = Math.max(0, Math.min(0.9999, progress));
  const idx = Math.min(Math.floor(c * SEGMENTS.length), SEGMENTS.length - 1);
  const t = c * SEGMENTS.length - idx;
  const [p0, p1, p2, p3] = SEGMENTS[idx];
  return bezier(t, p0, p1, p2, p3);
};

const PATH_D =
  'M64 92 C100 92 116 200 168 200 C220 200 224 110 268 110 C312 110 318 218 368 218 C418 218 420 124 458 124 C490 124 500 198 516 198';
const PATH_LENGTH = 720;

const STARS = [
  { x: 80, y: 58, r: 1.2, p: 0.1, c: false }, { x: 160, y: 48, r: 1.4, p: 1.2, c: true  },
  { x: 220, y: 62, r: 1.0, p: 2.4, c: false }, { x: 320, y: 50, r: 1.4, p: 0.7, c: true  },
  { x: 400, y: 58, r: 1.2, p: 1.9, c: false }, { x: 480, y: 46, r: 1.4, p: 3.1, c: true  },
  { x: 120, y: 40, r: 1.0, p: 2.0, c: false }, { x: 200, y: 80, r: 1.2, p: 0.4, c: true  },
  { x: 300, y: 38, r: 1.0, p: 1.5, c: false }, { x: 380, y: 82, r: 1.2, p: 2.7, c: true  },
];

export const CyclesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const TRAVEL_START = fps * 1;
  const TRAVEL_END = durationInFrames - fps * 4;
  const moonProgress = interpolate(frame, [TRAVEL_START, TRAVEL_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  const [moonX, moonY] = pointAt(moonProgress);
  const dashOffset = PATH_LENGTH * (1 - moonProgress);

  const pulse = (centerProgress: number) => {
    const center = TRAVEL_START + (TRAVEL_END - TRAVEL_START) * centerProgress;
    const scale = interpolate(frame, [center - fps * 0.3, center, center + fps * 1.6], [0, 1, 3.4],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [center - fps * 0.3, center, center + fps * 1.6], [0, 0.85, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return { scale, opacity };
  };
  const w1 = pulse(0.30); const [w1x, w1y] = pointAt(0.30);
  const w2 = pulse(0.70); const [w2x, w2y] = pointAt(0.70);

  const breath = 1 + 0.06 * Math.sin(frame * 0.06);
  const star = (p: number) => 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(frame * 0.08 + p));

  return (
    <AbsoluteFill style={{ background: NIGHT_BG, fontFamily: FONT, color: '#fff' }}>
      <Vignette />
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 560 300" style={{ width: '92%', height: 'auto' }}>
          <defs>
            <linearGradient id="cycPath" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={COLORS.cyan} />
              <stop offset="50%" stopColor={COLORS.teal} />
              <stop offset="100%" stopColor={COLORS.blue} />
            </linearGradient>
            <radialGradient id="cycMoon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor={COLORS.cyan} stopOpacity={0.65} />
              <stop offset="100%" stopColor={COLORS.teal} stopOpacity={0} />
            </radialGradient>
            <filter id="cycGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r}
              fill={s.c ? COLORS.cyan : '#FFFFFF'} opacity={star(s.p)} />
          ))}
          <rect x={40} y={86}  width={480} height={34} fill="#FFFFFF" opacity={0.035} rx={2} />
          <rect x={40} y={120} width={480} height={34} fill="#FFFFFF" opacity={0.06}  rx={2} />
          <rect x={40} y={154} width={480} height={34} fill="#FFFFFF" opacity={0.09}  rx={2} />
          <rect x={40} y={188} width={480} height={34} fill="#FFFFFF" opacity={0.13}  rx={2} />
          {[
            { y: 100, l: 'licht' }, { y: 134, l: 'REM' },
            { y: 168, l: 'middel' }, { y: 202, l: 'diep' },
          ].map(z => (
            <text key={z.l} x={48} y={z.y} fontSize={9} fontWeight={700}
                  fill={COLORS.cyan} opacity={0.6}>{z.l}</text>
          ))}
          <path d={PATH_D} fill="none" stroke={COLORS.bgLight} strokeWidth={2.5} opacity={0.55} />
          <path d={PATH_D} fill="none" stroke="url(#cycPath)" strokeWidth={3.5}
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={PATH_LENGTH} strokeDashoffset={dashOffset}
                filter="url(#cycGlow)" />
          <circle cx={w1x} cy={w1y} r={6 * w1.scale} fill={COLORS.cyan} opacity={w1.opacity} />
          <circle cx={w2x} cy={w2y} r={6 * w2.scale} fill={COLORS.cyan} opacity={w2.opacity} />
          <circle cx={moonX} cy={moonY} r={22 * breath} fill="url(#cycMoon)" opacity={0.75} />
          <circle cx={moonX} cy={moonY} r={8} fill="#FFFFFF" />
          {[
            { x: 64, l: '23:00' }, { x: 168, l: '01:00' }, { x: 268, l: '03:00' },
            { x: 368, l: '05:00' }, { x: 458, l: '07:00' },
          ].map(t => (
            <text key={t.l} x={t.x} y={244} textAnchor="middle"
                  fontSize={9} fontWeight={700} fill={COLORS.cyan} opacity={0.7}>{t.l}</text>
          ))}
        </svg>
      </AbsoluteFill>
      <Title text="Een nacht in slaap" />
      <Caption text="Kort wakker tussen cycli is normaal" fadeInAt={fps * 4} />
      <Wordmark />
    </AbsoluteFill>
  );
};
