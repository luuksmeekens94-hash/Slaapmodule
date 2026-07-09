import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT, PAPER_BG } from '../shared/tokens';
import { Wordmark } from '../shared/Frame';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => Easing.bezier(0.42, 0, 0.18, 1)(clamp(value));
const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const days = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
const sleepHours = [5.5, 6, 5.2, 6.1, 5.8, 6.0, 5.7];

export const RhythmScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const diaryIn = fade(frame, fps * 1.0, fps * 3.0);
  const decideIn = fade(frame, fps * 7.0, fps * 9.5);
  const shrink = ease((frame - fps * 10.0) / (fps * 5.5));
  const grow1 = ease((frame - fps * 19.0) / (fps * 2.5));
  const grow2 = ease((frame - fps * 24.0) / (fps * 2.2));
  const finalIn = fade(frame, durationInFrames - fps * 5.5, durationInFrames - fps * 3.5);

  const bedStart = 412;
  const sleepStart = 242;
  const matched = bedStart + (sleepStart - bedStart) * shrink;
  const plus1 = 28 * grow1;
  const plus2 = 28 * grow2;
  const bedWidth = matched + plus1 + plus2;
  const sleepWidth = sleepStart + plus1 + plus2;
  const bedLabel = grow2 > 0.8 ? '6u 15m' : grow1 > 0.8 ? '6u' : shrink > 0.85 ? '5u 45m' : '10u in bed';
  const phase = finalIn > 0.2
    ? 'rustig opbouwen'
    : grow1 > 0.2
      ? '+15 minuten als het goed gaat'
      : shrink > 0.55
        ? 'bedtijd passend maken'
        : decideIn > 0.4
          ? 'samen kiezen met je fysio'
          : 'eerst een week meten';
  const baseOpacity = 1 - finalIn * 0.78;

  return (
    <AbsoluteFill style={{ background: PAPER_BG, fontFamily: FONT, color: COLORS.ink }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 76% 18%, rgba(48,181,190,.18), transparent 30%), radial-gradient(circle at 10% 88%, rgba(24,64,160,.10), transparent 42%)' }} />

      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 560 300" style={{ width: '92%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="rhCard" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EDF6F8" />
            </linearGradient>
            <linearGradient id="rhSleep" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={COLORS.teal} />
              <stop offset="100%" stopColor={COLORS.navy} />
            </linearGradient>
            <filter id="rhShadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#0E1C38" floodOpacity="0.14" />
            </filter>
          </defs>

          <rect x="22" y="22" width="516" height="262" rx="26" fill="url(#rhCard)" stroke="#DDE8F4" strokeWidth="1.2" filter="url(#rhShadow)" />

          <text x="280" y="56" textAnchor="middle" fontSize="12" fontWeight="900" letterSpacing="2.8" fill={COLORS.steel}>
            SLAAPRITME RUSTIG BIJSTUREN
          </text>

          {/* Diary week */}
          <g opacity={diaryIn * baseOpacity} transform={`translate(64 ${78 + (1 - diaryIn) * 10})`}>
            {days.map((d, i) => {
              const h = sleepHours[i];
              const bar = 22 + (h - 5) * 17;
              return (
                <g key={d} transform={`translate(${i * 38} 0)`}>
                  <rect x="0" y="0" width="28" height="58" rx="9" fill="#F8FBFF" stroke="#D7E4F2" strokeWidth="1" />
                  <rect x="6" y={46 - bar} width="16" height={bar} rx="6" fill={COLORS.teal} opacity="0.82" />
                  <text x="14" y="74" textAnchor="middle" fontSize="10" fontWeight="800" fill={COLORS.inkSoft}>{d}</text>
                </g>
              );
            })}
            <text x="132" y="-12" textAnchor="middle" fontSize="12" fontWeight="800" fill={COLORS.navy}>slaapdagboek</text>
          </g>

          {/* Fysio decision badge */}
          <g opacity={decideIn * baseOpacity} transform={`translate(346 ${86 + (1 - decideIn) * 8})`}>
            <rect x="0" y="0" width="136" height="58" rx="18" fill="#EAF8FA" stroke="#A8DEE3" strokeWidth="1.2" />
            <text x="68" y="22" textAnchor="middle" fontSize="12" fontWeight="900" fill="#0E7480">samen met</text>
            <text x="68" y="40" textAnchor="middle" fontSize="16" fontWeight="900" fill={COLORS.navy}>je fysio</text>
          </g>

          {/* Sleep window bars */}
          <g transform="translate(72 174)" opacity={baseOpacity}>
            <text x="0" y="-12" fontSize="11" fontWeight="800" fill={COLORS.inkSoft}>tijd in bed</text>
            <rect x="0" y="0" width={bedWidth} height="34" rx="10" fill="#E5EAF4" stroke="#D3DDEA" strokeWidth="1.2" />
            <text x={bedWidth / 2} y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill={COLORS.inkSoft}>{bedLabel}</text>

            <text x="0" y="66" fontSize="11" fontWeight="800" fill={COLORS.inkSoft}>tijd dat je slaapt</text>
            <rect x="0" y="78" width={sleepWidth} height="34" rx="10" fill="url(#rhSleep)" />
            <text x={sleepWidth / 2} y="100" textAnchor="middle" fontSize="13" fontWeight="900" fill="#FFFFFF">
              {grow2 > 0.8 ? '6u 15m' : grow1 > 0.8 ? '6u' : '5u 45m'}
            </text>
          </g>

          <g opacity={baseOpacity} transform="translate(332 218)">
            <rect width="168" height="34" rx="17" fill="#FFFFFF" stroke="#CDE1F4" strokeWidth="1.4" />
            <text x="84" y="22" textAnchor="middle" fontSize="12" fontWeight="900" fill={COLORS.navy}>{phase}</text>
          </g>

          <g opacity={finalIn} transform={`translate(70 ${86 + (1 - finalIn) * 8})`}>
            <rect x="0" y="0" width="420" height="54" rx="18" fill="#FFFFFF" stroke="#BFE8EA" strokeWidth="1.3" />
            <text x="210" y="23" textAnchor="middle" fontSize="16" fontWeight="900" fill={COLORS.navy}>Maak je bedtijd passend.</text>
            <text x="210" y="41" textAnchor="middle" fontSize="12" fontWeight="750" fill={COLORS.inkSoft}>Bouw daarna rustig op.</text>
          </g>
        </svg>
      </AbsoluteFill>

      <Wordmark color={COLORS.navy} />
    </AbsoluteFill>
  );
};
