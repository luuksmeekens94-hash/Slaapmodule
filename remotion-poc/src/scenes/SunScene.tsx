import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONT } from '../shared/tokens';
import { Title, Caption, Vignette, Wordmark } from '../shared/Frame';

const STARS = [
  { x: 140, y: 80, r: 1.2, p: 0.1 },
  { x: 200, y: 62, r: 1.4, p: 1.2 },
  { x: 290, y: 78, r: 1.2, p: 2.4 },
  { x: 380, y: 60, r: 1.4, p: 0.7 },
  { x: 430, y: 78, r: 1.2, p: 1.9 },
];

export const SunScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Star fade-out (early)
  const starOp = interpolate(frame, [0, fps * 4], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const starTwinkle = (p: number) =>
    starOp * (0.5 + 0.5 * (0.5 + 0.5 * Math.sin(frame * 0.06 + p)));

  // Sky cross-fade: night → dawn (10–35%) → day (55–75%)
  const nightOpacity = interpolate(frame, [fps * 3, fps * 8], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const dawnOpacity = interpolate(
    frame, [fps * 3, fps * 7, fps * 16, fps * 22], [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const dayOpacity = interpolate(frame, [fps * 16, fps * 22], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Sun rises behind window: from y=240 (below sill) to y=130 (mid-window)
  const sunRiseStart = fps * 6;
  const sunRiseEnd = fps * 22;
  const sunY = interpolate(frame, [sunRiseStart, sunRiseEnd], [240, 130], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  const sunGlowOp = interpolate(frame, [sunRiseStart, sunRiseEnd], [0.35, 0.85], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Light beam onto floor
  const beamOp = interpolate(frame, [fps * 16, fps * 22], [0, 0.85], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Plant leaves lean toward light
  const leafLRot = interpolate(frame, [fps * 18, fps * 24], [0, -10], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1.2),
  });
  const leafRRot = interpolate(frame, [fps * 19, fps * 25], [0, -14], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1.2),
  });

  return (
    <AbsoluteFill style={{ background: COLORS.paper, fontFamily: FONT, color: COLORS.navy }}>
      <Vignette color={COLORS.amber} opacity={0.05} />
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 560 300" style={{ width: '92%', height: 'auto' }}>
          <defs>
            <linearGradient id="snNight" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={COLORS.bgMid} />
              <stop offset="100%" stopColor={COLORS.bgLight} />
            </linearGradient>
            <linearGradient id="snDawn" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7295C8" />
              <stop offset="50%" stopColor={COLORS.blush} />
              <stop offset="100%" stopColor={COLORS.amber} />
            </linearGradient>
            <linearGradient id="snDay" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={COLORS.cyan} />
              <stop offset="55%" stopColor={COLORS.cream} />
              <stop offset="100%" stopColor={COLORS.amber} />
            </linearGradient>
            <linearGradient id="snBeam" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.7} />
              <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
            </linearGradient>
            <radialGradient id="snDisc" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor={COLORS.amber} />
              <stop offset="100%" stopColor={COLORS.warm} stopOpacity={0} />
            </radialGradient>
          </defs>

          <line x1="38" y1="218" x2="522" y2="218"
                stroke="#C3D2E8" strokeWidth={1.4} />

          {/* Sky cross-fade panes */}
          <rect x="100" y="44" width="360" height="180" rx="6"
                fill="url(#snNight)" opacity={nightOpacity} />
          <rect x="100" y="44" width="360" height="180" rx="6"
                fill="url(#snDawn)" opacity={dawnOpacity} />
          <rect x="100" y="44" width="360" height="180" rx="6"
                fill="url(#snDay)" opacity={dayOpacity} />

          {/* Stars */}
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r}
                    fill={i % 2 === 0 ? '#fff' : COLORS.cyan}
                    opacity={starTwinkle(s.p)} />
          ))}

          {/* Sun */}
          <circle cx="280" cy={sunY} r="62"
                  fill="url(#snDisc)" opacity={sunGlowOp} />
          <circle cx="280" cy={sunY} r="28"
                  fill={COLORS.amber} stroke={COLORS.amberDeep} strokeWidth={1.6} />

          {/* Window frame */}
          <line x1="100" y1="134" x2="460" y2="134" stroke="#8FA5C7" strokeWidth={2} />
          <line x1="280" y1="44" x2="280" y2="224" stroke="#8FA5C7" strokeWidth={2} />
          <rect x="100" y="44" width="360" height="180" rx="6"
                fill="none" stroke="#8FA5C7" strokeWidth={3} />
          <rect x="88" y="220" width="384" height="10" rx="3"
                fill="#D6BFA0" stroke="#B89F7E" strokeWidth={1.2} />

          {/* Plant on sill */}
          <g transform="translate(420 220)">
            <rect x="-12" y="0" width="24" height="22" rx="2" fill="#A8927A" />
            <path d="M0 0 Q-12 -16 -8 -32 Q-2 -22 0 0" fill="#5C9E6E"
                  style={{ transformOrigin: '0 0', transform: `rotate(${leafLRot}deg)` }} />
            <path d="M0 0 Q12 -14 6 -28 Q-2 -18 0 0" fill="#7DBA8A"
                  style={{ transformOrigin: '0 0', transform: `rotate(${leafRRot}deg)` }} />
          </g>

          {/* Beam onto floor */}
          <polygon points="280,134 220,256 340,256"
                   fill="url(#snBeam)" opacity={beamOp} />
        </svg>
      </AbsoluteFill>
      <Title text="Ochtendlicht" color={COLORS.navy} />
      <Caption text="Daglicht is het startsignaal voor je lichaam"
               color={COLORS.navy} fadeInAt={fps * 4} />
      <Wordmark color={COLORS.navy} />
    </AbsoluteFill>
  );
};
