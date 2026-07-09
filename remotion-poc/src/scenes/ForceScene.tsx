import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT, PAPER_BG } from '../shared/tokens';
import { Wordmark } from '../shared/Frame';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => Easing.bezier(0.42, 0, 0.18, 1)(clamp(value));
const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const TextLabel: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  opacity?: number;
  fill?: string;
  size?: number;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
}> = ({ x, y, children, opacity = 1, fill = COLORS.ink, size = 13, weight = 800, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontSize={size} fontWeight={weight} fill={fill} opacity={opacity}>
    {children}
  </text>
);

export const ForceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const forceIn = fade(frame, fps * 1.4, fps * 4.0);
  const alert = ease((frame - fps * 3.0) / (fps * 8.0));
  const pause = fade(frame, fps * 10.0, fps * 13.0);
  const calm = ease((frame - fps * 14.0) / (fps * 8.0));
  const finalIn = fade(frame, durationInFrames - fps * 5.0, durationInFrames - fps * 3.2);
  const breathe = 1 + Math.sin(frame * 0.055) * 0.025;
  const restless = Math.sin(frame * 0.22) * 4 * forceIn * (1 - calm);
  const alertY = 208 - alert * 116;
  const calmY = 116 + calm * 68;

  return (
    <AbsoluteFill style={{ background: PAPER_BG, fontFamily: FONT, color: COLORS.ink }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 72% 24%, rgba(48,181,190,.18), transparent 34%), radial-gradient(circle at 12% 78%, rgba(24,64,160,.10), transparent 38%)' }} />

      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 560 300" style={{ width: '92%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="forceCard" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EDF6F8" />
            </linearGradient>
            <linearGradient id="forceAlert" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#E9A3A3" />
              <stop offset="100%" stopColor="#7A2828" />
            </linearGradient>
            <linearGradient id="forceCalm" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={COLORS.teal} />
              <stop offset="100%" stopColor={COLORS.navy} />
            </linearGradient>
            <filter id="forceShadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#0E1C38" floodOpacity="0.14" />
            </filter>
            <filter id="forceGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          <rect x="18" y="24" width="524" height="226" rx="26" fill="url(#forceCard)" stroke="#DDE8F4" strokeWidth="1.2" filter="url(#forceShadow)" />

          {/* Calm room / bed */}
          <g transform={`translate(58 ${132 + restless})`} opacity={0.98}>
            <rect x="0" y="54" width="186" height="44" rx="13" fill="#D9E8F6" stroke="#BED1EA" strokeWidth="1.4" />
            <rect x="14" y="34" width="58" height="30" rx="11" fill="#FFFFFF" stroke="#CAD9EE" strokeWidth="1.2" />
            <rect x="76" y="66" width="92" height="16" rx="8" fill="#BFD6EF" />
            <path d="M95 54 C112 38 138 40 150 56" fill="none" stroke={COLORS.navy} strokeWidth="3" strokeLinecap="round" opacity={0.65} />
            <circle cx="88" cy="49" r="8" fill="#FFFFFF" stroke={COLORS.navy} strokeOpacity=".38" strokeWidth="1.4" />
          </g>

          {/* Thought pressure */}
          <g opacity={forceIn * (1 - calm * 0.65)} transform={`translate(83 ${62 - alert * 8})`}>
            <rect x="0" y="0" width="158" height="46" rx="18" fill="#FFF4F4" stroke="#E9B8B8" strokeWidth="1.2" />
            <TextLabel x={79} y={20} size={11} fill="#7A2828">ik móet nu slapen</TextLabel>
            <TextLabel x={79} y={36} size={10} fill="#9B4B4B" weight={700}>druk maakt wakkerder</TextLabel>
          </g>

          {/* Protection meter */}
          <g transform="translate(302 74)">
            <TextLabel x={92} y={-10} size={12} fill={COLORS.steel}>beschermingssysteem</TextLabel>
            <rect x="0" y="0" width="184" height="156" rx="20" fill="#FFFFFF" stroke="#D9E4F3" strokeWidth="1.2" />
            <line x1="36" y1="124" x2="154" y2="124" stroke="#D5E0EF" strokeWidth="2" />
            <path d="M36 124 C72 132 80 66 108 66 C134 66 135 40 154 40" fill="none" stroke="url(#forceAlert)" strokeWidth="4" strokeLinecap="round" strokeDasharray="180" strokeDashoffset={180 * (1 - alert)} opacity={1 - calm * 0.72} />
            <circle cx={36 + alert * 118} cy={alertY} r="8" fill="#FFFFFF" stroke="#9B3333" strokeWidth="3" opacity={alert > 0.02 ? 1 - calm * 0.7 : 0} />
            <path d="M36 84 C76 106 105 102 154 88" fill="none" stroke="url(#forceCalm)" strokeWidth="5" strokeLinecap="round" strokeDasharray="150" strokeDashoffset={150 * (1 - calm)} opacity={calm} />
            <circle cx={36 + calm * 118} cy={calmY} r={9 * breathe} fill="#FFFFFF" stroke={COLORS.teal} strokeWidth="3" opacity={calm} />
            <TextLabel x={92} y={26} size={11} fill={calm > 0.6 ? COLORS.navy : '#7A2828'}>
              {calm > 0.62 ? 'rustsignaal' : 'alert'}
            </TextLabel>
          </g>

          {/* Keerpunt card */}
          <g opacity={pause} transform={`translate(170 ${218 - pause * 8})`}>
            <rect x="0" y="0" width="220" height="42" rx="21" fill="#EAF8FA" stroke="#A8DEE3" strokeWidth="1.2" />
            <TextLabel x={110} y={17} size={11} fill="#0E7480">haal de druk van slapen af</TextLabel>
            <TextLabel x={110} y={32} size={10} fill={COLORS.inkSoft} weight={700}>wacht op echte slaperigheid</TextLabel>
          </g>

          {/* Final message */}
          <g opacity={finalIn} transform={`translate(88 ${38 + (1 - finalIn) * 8})`}>
            <rect x="0" y="0" width="384" height="52" rx="18" fill="#FFFFFF" stroke="#BFE8EA" strokeWidth="1.3" />
            <TextLabel x={192} y={22} size={16} fill={COLORS.navy}>Slaap kun je niet duwen.</TextLabel>
            <TextLabel x={192} y={40} size={12} fill={COLORS.inkSoft}>Je kunt je lichaam wel rust geven.</TextLabel>
          </g>
        </svg>
      </AbsoluteFill>

      <Wordmark color={COLORS.navy} />
    </AbsoluteFill>
  );
};
