import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONT, PAPER_BG } from '../shared/tokens';
import { Title, Caption, Vignette, Wordmark } from '../shared/Frame';

// Sun travels along arc M80,84 Q280,36 480,84
// Quadratic Bezier: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
const arcPoint = (t: number): [number, number] => {
  const u = 1 - t;
  return [
    u * u * 80 + 2 * u * t * 280 + t * t * 480,
    u * u * 84 + 2 * u * t * 36 + t * t * 84,
  ];
};

export const PressureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phase keyframes
  const T_FILL_END = fps * 12;     // initial fill 0..100
  const T_DUTJE = fps * 13;        // dutje appears
  const T_LEAK = fps * 14;         // liquid drops
  const T_RECOVER = fps * 17;      // dutje fades, liquid rises again
  const T_FULL = fps * 22;         // full
  const T_NIGHT = fps * 24;        // moon appears

  // Sun travels arc 0..78%
  const sunProgress = interpolate(frame, [0, fps * 22], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  const [sunX, sunY] = arcPoint(sunProgress);
  const sunOpacity = interpolate(frame, [T_FULL, T_NIGHT], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const moonOpacity = interpolate(frame, [T_NIGHT, T_NIGHT + fps * 1], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Liquid level (height grows; y descends from 234)
  // 0 → height 100 (y=134); leak → height 80 (y=154); recover → height 150 (y=84)
  let liquidHeight = 0;
  let liquidY = 234;
  if (frame < T_FILL_END) {
    liquidHeight = interpolate(frame, [0, T_FILL_END], [0, 100], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.bezier(0.5, 0.05, 0.45, 0.95),
    });
    liquidY = 234 - liquidHeight;
  } else if (frame < T_LEAK) {
    liquidHeight = 100;
    liquidY = 134;
  } else if (frame < T_RECOVER) {
    liquidHeight = interpolate(frame, [T_LEAK, T_LEAK + fps * 1.2], [100, 80], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.in(Easing.cubic),
    });
    liquidY = 234 - liquidHeight;
  } else {
    liquidHeight = interpolate(frame, [T_RECOVER, T_FULL], [80, 150], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.bezier(0.42, 0, 0.58, 1),
    });
    liquidY = 234 - liquidHeight;
  }

  // Dutje warning chip
  const dutjeOp = interpolate(frame, [T_DUTJE, T_DUTJE + fps * 0.5, T_RECOVER, T_RECOVER + fps * 0.6],
    [0, 1, 0.6, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dutjeScale = interpolate(frame, [T_DUTJE, T_DUTJE + fps * 0.5], [0.85, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1.4),
  });

  // Final caption
  const finalOp = interpolate(frame, [T_FULL, T_FULL + fps * 0.8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const finalScale = interpolate(frame, [T_FULL, T_FULL + fps * 0.8], [0.92, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1.2),
  });

  // Surface highlight ripple
  const ripple = Math.sin(frame * 0.12) * 1.2;

  return (
    <AbsoluteFill style={{ background: PAPER_BG, fontFamily: FONT, color: COLORS.navy }}>
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 560 300" style={{ width: '92%', height: 'auto' }}>
          <defs>
            <linearGradient id="prLiq" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={COLORS.cyan} />
              <stop offset="50%" stopColor={COLORS.teal} />
              <stop offset="100%" stopColor={COLORS.navy} />
            </linearGradient>
            <linearGradient id="prGlass" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#E5EAF4" stopOpacity={0.75} />
              <stop offset="50%" stopColor="#F8FAFE" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#E5EAF4" stopOpacity={0.75} />
            </linearGradient>
            <radialGradient id="prSun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor={COLORS.amber} />
              <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
            </radialGradient>
            <radialGradient id="prMoon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor={COLORS.cyan} />
              <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0} />
            </radialGradient>
            <clipPath id="prClip">
              <rect x="234" y="74" width="92" height="160" rx="14" />
            </clipPath>
          </defs>

          {/* Day arc */}
          <path d="M80 84 Q 280 36 480 84"
                fill="none" stroke="#CDE1F4" strokeWidth={2} strokeDasharray="4 6" />

          {/* Sun */}
          <g opacity={sunOpacity}>
            <circle cx={sunX} cy={sunY} r="22" fill="url(#prSun)" opacity={0.7} />
            <circle cx={sunX} cy={sunY} r="9"
                    fill={COLORS.amber} stroke={COLORS.amberDeep} strokeWidth={1.4} />
          </g>

          {/* Moon */}
          <g opacity={moonOpacity}>
            <circle cx="480" cy="84" r="22" fill="url(#prMoon)" opacity={0.5} />
            <circle cx="480" cy="84" r="9" fill="#F4F8FE" />
          </g>

          {/* Glass beaker */}
          <rect x="234" y="74" width="92" height="160" rx="14"
                fill="url(#prGlass)" stroke="#8FA5C7" strokeWidth={2} />

          {/* Liquid (clipped) */}
          <g clipPath="url(#prClip)">
            <rect x="234" y={liquidY} width="92" height={liquidHeight}
                  fill="url(#prLiq)" />
            {liquidHeight > 0 && (
              <ellipse cx="280" cy={liquidY} rx={44 + ripple} ry={3 + Math.abs(ripple) * 0.3}
                       fill="#FFFFFF" opacity={0.55} />
            )}
          </g>

          {/* Beaker label */}
          <text x="280" y="60" textAnchor="middle"
                fontSize="11" fontWeight={800} fill={COLORS.inkSoft} letterSpacing={3}>
            SLAAPDRUK
          </text>

          {/* Dutje warning */}
          <g transform={`translate(424 138) scale(${dutjeScale})`} opacity={dutjeOp}>
            <rect x="-44" y="-16" width="88" height="32" rx="16"
                  fill="#FFF5F5" stroke="#F3C5C5" strokeWidth={1.4} />
            <text x="0" y="5" textAnchor="middle"
                  fontSize="12" fontWeight={800} fill={COLORS.rose}>dutje?</text>
          </g>

          {/* Final caption pill */}
          <g transform={`translate(180 252) scale(${finalScale})`} opacity={finalOp}
             style={{ transformOrigin: '280px 267px' }}>
            <rect width="200" height="30" rx="15"
                  fill="#ECF8F1" stroke={COLORS.greenSoft} strokeWidth={1.4} />
            <text x="100" y="20" textAnchor="middle"
                  fontSize="12" fontWeight={800} fill={COLORS.green}>klaar voor de nacht</text>
          </g>
        </svg>
      </AbsoluteFill>
      <Title text="Slaapdruk bouwt op" color={COLORS.navy} />
      <Caption text="Geen dutjes — laat de druk hoog blijven"
               color={COLORS.navy} fadeInAt={fps * 4} />
      <Wordmark color={COLORS.navy} />
    </AbsoluteFill>
  );
};
