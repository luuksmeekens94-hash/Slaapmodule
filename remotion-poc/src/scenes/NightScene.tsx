import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONT, NIGHT_BG } from '../shared/tokens';
import { Title, Caption, Vignette, Wordmark } from '../shared/Frame';

// Walker waypoints in viewBox coordinates (560×300):
// starts at bed (310, 178), ends at chair (462, 124).
const WAYPOINTS: Array<[number, number]> = [
  [310, 178], [340, 168], [368, 158], [394, 148], [418, 138], [438, 130], [462, 124],
];

const TRAIL_DOTS = [
  { x: 320, y: 174, p: 0.0 },
  { x: 350, y: 160, p: 0.5 },
  { x: 380, y: 150, p: 1.0 },
  { x: 410, y: 142, p: 1.5 },
  { x: 438, y: 138, p: 2.0 },
];

const STARS = [
  { x: 200, y: 62, r: 1.2, p: 0.2 }, { x: 280, y: 48, r: 1.4, p: 1.4 },
  { x: 350, y: 58, r: 1.2, p: 2.6 }, { x: 430, y: 54, r: 1.4, p: 0.8 },
];

export const NightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Walker timing
  const walkStart = fps * 4;
  const walkEnd = durationInFrames - fps * 8;
  const walkProgress = interpolate(frame, [walkStart, walkEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  const walkerOpacity = interpolate(frame, [walkStart - fps * 0.4, walkStart], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // Pick waypoint pair
  const seg = WAYPOINTS.length - 1;
  const segIdx = Math.min(Math.floor(walkProgress * seg), seg - 1);
  const segT = walkProgress * seg - segIdx;
  const [ax, ay] = WAYPOINTS[segIdx];
  const [bx, by] = WAYPOINTS[segIdx + 1];
  const wx = ax + (bx - ax) * segT;
  const wy = ay + (by - ay) * segT;

  // Trail dots reveal in sequence
  const trailOpacity = (i: number) => {
    const t = walkStart + i * fps * 0.6;
    return interpolate(frame, [t, t + fps * 0.4], [0, 0.85], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  };
  const trailFlicker = (p: number) => 0.6 + 0.3 * Math.sin(frame * 0.08 + p * 2);

  // Lamp glow grows when walker arrives
  const lampGlow = interpolate(frame, [walkEnd - fps * 1, walkEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const lampPulse = 1 + 0.05 * Math.sin(frame * 0.04);

  // Stars twinkle
  const starOp = (p: number) => 0.4 + 0.4 * (0.5 + 0.5 * Math.sin(frame * 0.05 + p));

  // Time pill subtle pulse
  const timePulse = 1 + 0.02 * Math.sin(frame * 0.03);

  return (
    <AbsoluteFill style={{ background: NIGHT_BG, fontFamily: FONT, color: '#fff' }}>
      <Vignette opacity={0.12} />
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 560 300" style={{ width: '92%', height: 'auto' }}>
          <defs>
            <radialGradient id="ngLamp" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.85} />
              <stop offset="55%" stopColor={COLORS.warm} stopOpacity={0.30} />
              <stop offset="100%" stopColor={COLORS.warm} stopOpacity={0} />
            </radialGradient>
            <radialGradient id="ngMoon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor={COLORS.cyan} stopOpacity={0.7} />
              <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* Stars */}
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r}
                    fill="#fff" opacity={starOp(s.p)} />
          ))}

          {/* Window with moon */}
          <g transform="translate(56 64)">
            <rect x="0" y="0" width="80" height="76" rx="4"
                  fill={COLORS.bgDeep} stroke={COLORS.bgLight} strokeWidth={1.4} />
            <line x1="40" y1="0" x2="40" y2="76" stroke={COLORS.bgLight} strokeWidth={1.2} />
            <line x1="0" y1="38" x2="80" y2="38" stroke={COLORS.bgLight} strokeWidth={1.2} />
            <circle cx="56" cy="26" r="28" fill="url(#ngMoon)" opacity={0.6} />
            <circle cx="56" cy="26" r="11" fill="#F4F8FE" />
          </g>

          {/* Time pill */}
          <g transform={`translate(56 244) scale(${timePulse})`}>
            <rect width="86" height="28" rx="14"
                  fill={COLORS.bgLight} stroke={COLORS.cyan} strokeWidth={1.2} opacity={0.75} />
            <text x="43" y="19" textAnchor="middle"
                  fontSize="13" fontWeight={800} fill="#FFFFFF">03:14</text>
          </g>

          {/* Bed silhouette */}
          <g transform="translate(220 156)">
            <rect x="0" y="20" width="100" height="38" rx="8"
                  fill={COLORS.bgLight} stroke={'#5A7BB0'} strokeWidth={1.2} />
            <rect x="6" y="2" width="32" height="22" rx="6" fill="#5A7BB0" />
            <rect x="40" y="32" width="56" height="14" rx="6" fill="#2A4475" />
          </g>

          {/* Trail dots */}
          {TRAIL_DOTS.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={3}
                    fill={COLORS.amber} opacity={trailOpacity(i) * trailFlicker(d.p)} />
          ))}

          {/* Walker */}
          <circle cx={wx} cy={wy} r={6} fill="#FFFFFF" opacity={walkerOpacity} />

          {/* Reading nook */}
          <g transform="translate(456 124)">
            <circle cx="0" cy="-4" r={62 * lampPulse} fill="url(#ngLamp)" opacity={lampGlow} />
            <line x1="0" y1="-32" x2="0" y2="-12" stroke="#A8927A" strokeWidth={2} />
            <path d="M-18 -32 L18 -32 L14 -52 L-14 -52 Z"
                  fill={COLORS.amber} stroke={COLORS.amberDeep} strokeWidth={1.2} />
            <rect x="-30" y="0" width="60" height="50" rx="10"
                  fill={COLORS.bgLight} stroke="#7295C8" strokeWidth={1.2} />
            <rect x="-22" y="-10" width="44" height="14" rx="4" fill="#7295C8" />
          </g>
        </svg>
      </AbsoluteFill>
      <Title text="Lang wakker?" />
      <Caption text="Stap rustig uit bed. Houd licht en activiteit klein." fadeInAt={fps * 4} />
      <Wordmark />
    </AbsoluteFill>
  );
};
