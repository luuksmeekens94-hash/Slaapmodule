import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT, NIGHT_BG } from '../shared/tokens';
import { Vignette, Wordmark } from '../shared/Frame';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => Easing.bezier(0.42, 0, 0.18, 1)(clamp(value));
const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const cycleCenters = [86, 180, 274, 368, 462];
const stars = [
  [78, 58, 1.1, 0.2], [142, 42, 1.4, 1.1], [222, 64, 1.0, 2.3], [312, 46, 1.2, 0.9],
  [404, 66, 1.2, 2.8], [486, 50, 1.4, 1.7], [112, 96, 0.9, 2.0], [452, 94, 0.9, 3.1],
] as const;

export const CyclesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = ease((frame - fps * 1.0) / (durationInFrames - fps * 6.0));
  const nightX = 54 + progress * 452;
  const wake1 = fade(frame, fps * 7.0, fps * 8.0) * (1 - fade(frame, fps * 11.0, fps * 12.2));
  const wake2 = fade(frame, fps * 16.0, fps * 17.0) * (1 - fade(frame, fps * 20.0, fps * 21.2));
  const reassure = fade(frame, fps * 18.0, fps * 21.5);
  const finalIn = fade(frame, durationInFrames - fps * 5.0, durationInFrames - fps * 3.2);
  const breath = 1 + Math.sin(frame * 0.05) * 0.025;

  return (
    <AbsoluteFill style={{ background: NIGHT_BG, fontFamily: FONT, color: '#fff' }}>
      <Vignette opacity={0.16} />
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 560 300" style={{ width: '92%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="cyclePanel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#13264C" />
              <stop offset="100%" stopColor="#0B1732" />
            </linearGradient>
            <linearGradient id="cycleWave" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={COLORS.cyan} />
              <stop offset="52%" stopColor={COLORS.teal} />
              <stop offset="100%" stopColor="#D6E5FF" />
            </linearGradient>
            <filter id="cycleShadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000000" floodOpacity="0.22" />
            </filter>
            <radialGradient id="cycleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor={COLORS.cyan} stopOpacity="0.72" />
              <stop offset="100%" stopColor={COLORS.teal} stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="24" y="30" width="512" height="216" rx="28" fill="url(#cyclePanel)" stroke="#33578E" strokeWidth="1.2" filter="url(#cycleShadow)" />

          {stars.map(([x, y, r, phase], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? COLORS.cyan : '#FFFFFF'} opacity={0.35 + 0.42 * (0.5 + 0.5 * Math.sin(frame * 0.07 + phase))} />
          ))}

          <text x="280" y="62" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="800" fill="#A0E8ED" letterSpacing="2.8" opacity="0.86">
            SLAAP BEWEEGT IN RONDES
          </text>

          {/* Soft cycle pillows, not a technical chart */}
          {cycleCenters.map((x, i) => {
            const active = Math.max(0, 1 - Math.abs(progress * 4.6 - i) / 0.85);
            return (
              <g key={i} opacity={0.42 + active * 0.45}>
                <rect x={x - 38} y="116" width="76" height="52" rx="26" fill="#213B71" stroke="#5277AE" strokeWidth="1.1" />
                <path d={`M${x - 22} 143 C${x - 8} 125 ${x + 8} 125 ${x + 22} 143`} fill="none" stroke={COLORS.cyan} strokeWidth={2.2} strokeLinecap="round" opacity={0.78} />
              </g>
            );
          })}

          <path d="M54 144 C96 98 134 190 180 144 C224 98 232 190 274 144 C318 98 326 190 368 144 C410 98 424 190 462 144 C486 118 500 132 506 144"
                fill="none" stroke="url(#cycleWave)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="620" strokeDashoffset={620 * (1 - progress)} opacity="0.95" />

          <circle cx={nightX} cy={144 + Math.sin(progress * Math.PI * 9) * 35} r={23 * breath} fill="url(#cycleGlow)" opacity="0.75" />
          <circle cx={nightX} cy={144 + Math.sin(progress * Math.PI * 9) * 35} r="8" fill="#FFFFFF" />

          {[{ x: 180, y: 116, o: wake1 }, { x: 368, y: 116, o: wake2 }].map((w, i) => (
            <g key={i} opacity={w.o}>
              <circle cx={w.x} cy={w.y} r={10 + w.o * 16} fill={COLORS.cyan} opacity={0.20 * w.o} />
              <rect x={w.x - 34} y={w.y - 34} width="68" height="26" rx="13" fill="#EAF8FA" stroke="#A8DEE3" strokeWidth="1" />
              <text x={w.x} y={w.y - 16} textAnchor="middle" fontSize="10" fontWeight="800" fill={COLORS.navy}>even wakker</text>
            </g>
          ))}

          <g opacity={reassure} transform={`translate(154 ${204 - reassure * 6})`}>
            <rect x="0" y="0" width="252" height="34" rx="17" fill="#FFFFFF" stroke="#A8DEE3" strokeWidth="1.2" />
            <text x="126" y="22" textAnchor="middle" fontSize="13" fontWeight="800" fill={COLORS.navy}>niet rekenen · geruststellen</text>
          </g>

          <g opacity={finalIn} transform={`translate(70 ${78 + (1 - finalIn) * 8})`}>
            <rect x="0" y="0" width="420" height="54" rx="18" fill="#FFFFFF" opacity="0.96" />
            <text x="210" y="23" textAnchor="middle" fontSize="16" fontWeight="900" fill={COLORS.navy}>Kort wakker worden is normaal.</text>
            <text x="210" y="41" textAnchor="middle" fontSize="12" fontWeight="750" fill={COLORS.inkSoft}>Rekenen maakt het groter.</text>
          </g>
        </svg>
      </AbsoluteFill>
      <Wordmark />
    </AbsoluteFill>
  );
};
