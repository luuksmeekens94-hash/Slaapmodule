import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONT, DAWN_BG } from '../shared/tokens';
import { Title, Caption, Vignette, Wordmark } from '../shared/Frame';

const DAYS = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

export const ClockScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const SUN_BOTTOM_Y = 220;
  const SUN_ANCHOR_Y = 138;
  const SUN_TRAVEL = SUN_ANCHOR_Y - SUN_BOTTOM_Y; // -82

  const sunsStart = fps * 1.2;
  const sunsEnd = durationInFrames - fps * 6;
  const perDay = (sunsEnd - sunsStart) / DAYS.length;

  const sunY = (i: number) => {
    const start = sunsStart + i * perDay;
    return interpolate(frame, [start, start + perDay * 0.55], [SUN_BOTTOM_Y, SUN_ANCHOR_Y], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  };
  const sunOpacity = (i: number) => {
    const start = sunsStart + i * perDay;
    return interpolate(frame, [start, start + perDay * 0.4], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  };
  const sunGlow = (i: number) => {
    const start = sunsStart + i * perDay;
    return interpolate(frame, [start, start + perDay * 0.4], [0, 0.85], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  };

  // Anchor line draws after all suns are up
  const anchorLen = 380;
  const anchorStart = sunsEnd;
  const anchorOffset = interpolate(frame, [anchorStart, anchorStart + fps * 1.5], [anchorLen, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Time pill emphasis
  const timePulse = 1 + 0.04 * Math.sin(frame * 0.04);

  return (
    <AbsoluteFill style={{ background: DAWN_BG, fontFamily: FONT, color: COLORS.navy }}>
      <Vignette color={COLORS.amber} opacity={0.06} />
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 560 300" style={{ width: '92%', height: 'auto' }}>
          <defs>
            <radialGradient id="ckSunBurst" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor={COLORS.amber} />
              <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* Anchor line — draws on at end */}
          <line x1="120" y1="138" x2="500" y2="138"
                stroke="#FFFFFF" strokeWidth={2} strokeDasharray="4 6"
                style={{
                  strokeDasharray: anchorLen,
                  strokeDashoffset: anchorOffset,
                }} />
          {/* Static dashed cue line (subtle) */}
          <line x1="120" y1="138" x2="500" y2="138"
                stroke="#FFFFFF" strokeWidth={1.4} strokeDasharray="4 6" opacity={0.35} />

          {/* Time anchor pill */}
          <g transform={`translate(40 122) scale(${timePulse})`} style={{ transformOrigin: '72px 139px' }}>
            <rect width="64" height="34" rx="8"
                  fill="#FFFFFF" stroke={COLORS.navy} strokeWidth={1.6} />
            <text x="32" y="22" textAnchor="middle"
                  fontSize="13" fontWeight={800} fill={COLORS.navy}>07:00</text>
          </g>

          {/* Day columns + suns */}
          {DAYS.map((day, i) => {
            const cx = 140 + i * 56;
            const y = sunY(i);
            return (
              <g key={day}>
                <line x1={cx} y1={60} x2={cx} y2={218}
                      stroke="#FFFFFF" strokeWidth={1} opacity={0.25} />
                <text x={cx} y={234} textAnchor="middle"
                      fontSize={12} fontWeight={800} fill={COLORS.navy}>{day}</text>
                <circle cx={cx} cy={y} r={22}
                        fill="url(#ckSunBurst)" opacity={sunGlow(i)} />
                <circle cx={cx} cy={y} r={8}
                        fill={COLORS.amber} stroke={COLORS.amberDeep} strokeWidth={1.4}
                        opacity={sunOpacity(i)} />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <Title text="Vaste opsta-tijd" color={COLORS.navy} />
      <Caption text="Elke dag dezelfde wektijd is je anker"
               color={COLORS.navy} fadeInAt={fps * 4} />
      <Wordmark color={COLORS.navy} />
    </AbsoluteFill>
  );
};
