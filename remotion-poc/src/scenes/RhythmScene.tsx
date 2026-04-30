import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONT, PAPER_BG } from '../shared/tokens';
import { Title, Caption, Vignette, Wordmark } from '../shared/Frame';

export const RhythmScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phase keyframes (in frames):
  const T_INITIAL = fps * 1.0;
  const T_SHRINK = fps * 6.0;       // bed shrinks
  const T_PULSE = fps * 12.0;       // both pulse
  const T_GROW1 = fps * 16.0;       // grow +15min → 6u
  const T_GROW2 = fps * 22.0;       // grow +15min → 6u 15m

  // Bed bar width: 440 (10u) → 252 (5u 45m) → 280 (6u) → 308 (6u 15m)
  let bedWidth = 440;
  if (frame >= T_SHRINK) {
    bedWidth = interpolate(frame, [T_SHRINK, T_SHRINK + fps * 2], [440, 252], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }
  if (frame >= T_GROW1) {
    bedWidth = interpolate(frame, [T_GROW1, T_GROW1 + fps * 1.2], [252, 280], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }
  if (frame >= T_GROW2) {
    bedWidth = interpolate(frame, [T_GROW2, T_GROW2 + fps * 1.2], [280, 308], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }

  // Sleep bar: stays 252 until grow phases
  let sleepWidth = 252;
  if (frame >= T_GROW1) {
    sleepWidth = interpolate(frame, [T_GROW1, T_GROW1 + fps * 1.2], [252, 280], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }
  if (frame >= T_GROW2) {
    sleepWidth = interpolate(frame, [T_GROW2, T_GROW2 + fps * 1.2], [280, 308], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }

  // Labels
  let bedText = '10u';
  if (frame >= T_SHRINK + fps * 2) bedText = '5u 45m';
  if (frame >= T_GROW1 + fps * 1.2) bedText = '6u';
  if (frame >= T_GROW2 + fps * 1.2) bedText = '6u 15m';

  let sleepText = '5u 45m';
  if (frame >= T_GROW1 + fps * 1.2) sleepText = '6u';
  if (frame >= T_GROW2 + fps * 1.2) sleepText = '6u 15m';

  // Phase caption
  let phase = 'veel tijd in bed, weinig slaap';
  if (frame >= T_SHRINK) phase = 'bed = slaaptijd';
  if (frame >= T_PULSE) phase = 'bijna alles slaap';
  if (frame >= T_GROW1) phase = 'rustig uitbreiden +15 min';

  // Pulse on T_PULSE
  let yShift = 0;
  if (frame >= T_PULSE && frame < T_PULSE + fps * 1.4) {
    const local = (frame - T_PULSE) / (fps * 1.4);
    yShift = -3 * Math.sin(local * Math.PI * 2);
  }

  return (
    <AbsoluteFill style={{ background: PAPER_BG, fontFamily: FONT, color: COLORS.navy }}>
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 560 300" style={{ width: '92%', height: 'auto' }}>
          <defs>
            <linearGradient id="rhSleep" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={COLORS.teal} />
              <stop offset="100%" stopColor={COLORS.navy} />
            </linearGradient>
          </defs>
          <text x="280" y="56" textAnchor="middle"
                fontSize="11" fontWeight={800} fill={COLORS.steel}
                letterSpacing={3}>SLAAPVENSTER AANPASSEN</text>

          {/* Bar 1: tijd in bed */}
          <text x="60" y="100" fontSize="11" fontWeight={700} fill={COLORS.inkSoft}>
            tijd in bed
          </text>
          <rect x="60" y={108 + yShift} width={bedWidth} height={36} rx={8}
                fill="#E5EAF4" stroke="#D3DDEA" strokeWidth={1.2} />
          <text x={60 + bedWidth / 2} y={131 + yShift} textAnchor="middle"
                fontSize={13} fontWeight={800} fill={COLORS.inkSoft}>{bedText}</text>

          {/* Bar 2: tijd dat je slaapt */}
          <text x="60" y="172" fontSize="11" fontWeight={700} fill={COLORS.inkSoft}>
            tijd dat je slaapt
          </text>
          <rect x="60" y={180 + yShift} width={sleepWidth} height={36} rx={8}
                fill="url(#rhSleep)" />
          <text x={60 + sleepWidth / 2} y={203 + yShift} textAnchor="middle"
                fontSize={13} fontWeight={800} fill="#FFFFFF">{sleepText}</text>

          {/* Phase caption pill */}
          <g transform="translate(180 244)">
            <rect width="200" height="30" rx="15"
                  fill="#FFFFFF" stroke="#CDE1F4" strokeWidth={1.4} />
            <text x="100" y="20" textAnchor="middle"
                  fontSize="12" fontWeight={800} fill={COLORS.navy}>{phase}</text>
          </g>
        </svg>
      </AbsoluteFill>
      <Title text="Slaapvenster" color={COLORS.navy} />
      <Caption text="Bed = slaaptijd. Daarna rustig uitbreiden."
               color={COLORS.navy} fadeInAt={fps * 4} />
      <Wordmark color={COLORS.navy} />
    </AbsoluteFill>
  );
};
