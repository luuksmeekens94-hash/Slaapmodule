import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

const ease = (frame: number, from: number, to: number) =>
  Easing.bezier(0.42, 0, 0.2, 1)(
    interpolate(frame, [from, to], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

const fadeWindow = (frame: number, inStart: number, inEnd: number, outStart: number, outEnd: number) =>
  ease(frame, inStart, inEnd) * (1 - ease(frame, outStart, outEnd));

export const ForceAnimaticScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pressureIn = ease(frame, 105, 255);
  const pressureOut = ease(frame, 390, 510);
  const tension = pressureIn * (1 - pressureOut);
  const release = ease(frame, 390, 520);
  const endFade = ease(frame, 620, 660);
  const endText = ease(frame, 650, 690);
  const blink = fadeWindow(frame, 48, 54, 60, 66) + fadeWindow(frame, 330, 336, 342, 348);
  const camera = 1 + ease(frame, 0, 390) * 0.025 - release * 0.018;
  const slowBreath = Math.sin(frame * 0.034) * 8;
  const fastBreath = Math.sin(frame * 0.085) * 5;
  const breath = slowBreath * (1 - tension) + fastBreath * tension;
  const shoulderLift = tension * 34;
  const roomInset = tension * 58;
  const calmGlow = release * (1 - endFade);

  return (
    <AbsoluteFill style={{background: '#171C25', fontFamily: 'Inter, Segoe UI, Arial, sans-serif', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${camera})`, opacity: 1 - endFade}}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <linearGradient id="animaticRoom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#464D59" />
              <stop offset="100%" stopColor="#2C323C" />
            </linearGradient>
            <linearGradient id="animaticMoon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E4E7EA" stopOpacity=".68" />
              <stop offset="100%" stopColor="#B9C0C8" stopOpacity=".08" />
            </linearGradient>
            <filter id="animaticSoft"><feGaussianBlur stdDeviation="24" /></filter>
          </defs>

          <rect x={110 + roomInset} y="84" width={1700 - roomInset * 2} height="900" rx="48" fill="url(#animaticRoom)" stroke="#707782" strokeWidth="3" />
          <path d={`M${164 + roomInset} 84 H${1756 - roomInset} V984 H${164 + roomInset}Z`} fill="none" stroke="#666D78" strokeWidth="2" opacity=".55" />

          <rect x={230 + roomInset * 0.35} y="150" width={330 - roomInset * 0.25} height="300" rx="20" fill="#242A33" stroke="#747B85" strokeWidth="3" />
          <circle cx={344 + roomInset * 0.25} cy="260" r="78" fill="#D4D8DD" opacity=".72" />
          <circle cx={382 + roomInset * 0.25} cy="232" r="78" fill="#242A33" />
          <path
            d={`M${300 + roomInset * 0.2} 450 L${650 + roomInset * 0.35} 910 L${1020 - roomInset * 0.2} 910 L${500 + roomInset * 0.2} 450Z`}
            fill="url(#animaticMoon)"
            opacity={0.68 - tension * 0.25 + calmGlow * 0.18}
          />

          <ellipse cx="947" cy="885" rx="650" ry="66" fill="#10141A" opacity=".34" filter="url(#animaticSoft)" />
          <rect x="320" y="690" width="1240" height="180" rx="34" fill="#5B626D" stroke="#878E97" strokeWidth="4" />
          <rect x="362" y="590" width="320" height="150" rx="46" fill="#D1D4D8" stroke="#8E949C" strokeWidth="4" />
          <path
            d={`M650 ${690 - shoulderLift} C820 ${535 - shoulderLift} 1100 ${565 - shoulderLift} 1240 ${700 - shoulderLift * 0.5} C1340 660 1470 690 1520 746 L1520 845 H610Z`}
            fill="#9AA0A8"
            stroke="#C0C4C9"
            strokeWidth="5"
          />
          <path d={`M650 ${703 - shoulderLift} C860 ${630 - shoulderLift} 1060 ${635 - shoulderLift} 1240 ${706 - shoulderLift * 0.45}`} fill="none" stroke="#C8CCD0" strokeWidth="8" strokeLinecap="round" opacity=".72" />

          <circle cx="696" cy={590 - shoulderLift * 0.22} r="82" fill="#A8ADB4" stroke="#D0D3D7" strokeWidth="5" />
          <path d={`M620 ${586 - shoulderLift * 0.22} C626 ${492 - shoulderLift * 0.2} 765 ${480 - shoulderLift * 0.2} 788 ${584 - shoulderLift * 0.22}`} fill="#373D47" />
          <path d={`M733 ${612 - shoulderLift * 0.22} Q754 ${623 + tension * 6 - shoulderLift * 0.22} 774 ${612 - shoulderLift * 0.22}`} fill="none" stroke="#565C64" strokeWidth="5" strokeLinecap="round" />
          {blink > 0.1 ? (
            <line x1="718" y1={580 - shoulderLift * 0.22} x2="742" y2={580 - shoulderLift * 0.22} stroke="#343941" strokeWidth="6" strokeLinecap="round" />
          ) : (
            <path d={`M718 ${582 - shoulderLift * 0.22} Q730 ${572 - tension * 8 - shoulderLift * 0.22} 742 ${582 - shoulderLift * 0.22}`} fill="none" stroke="#343941" strokeWidth="4" strokeLinecap="round" />
          )}

          <path d={`M842 ${690 - shoulderLift} C810 ${647 - shoulderLift * 0.7} 772 ${630 - shoulderLift * 0.35} 742 ${637 - shoulderLift * 0.25}`} fill="none" stroke="#A8ADB4" strokeWidth="34" strokeLinecap="round" />
          <circle cx="850" cy={693 - shoulderLift} r={24 - tension * 3} fill="#B3B7BD" stroke="#D0D3D7" strokeWidth="3" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${838 + i * 12} ${686 - shoulderLift} q${8 - tension * 4} ${20 + tension * 2} ${18 - tension * 3} ${33 - tension * 3}`} fill="none" stroke="#777D85" strokeWidth="4" strokeLinecap="round" />
          ))}

          <path d={`M616 ${704 - shoulderLift} C812 ${654 - shoulderLift} 1094 ${658 - shoulderLift} 1318 ${720 - shoulderLift * 0.6}`} fill="none" stroke="#D4D7DA" strokeWidth="8" strokeLinecap="round" opacity=".45" />
          <path d={`M602 ${755 + breath} C870 ${720 + breath} 1135 ${730 + breath} 1452 ${770 + breath}`} fill="none" stroke="#C6CACF" strokeWidth="7" strokeLinecap="round" opacity=".58" />

          <circle cx="1500" cy="235" r={110 + calmGlow * 32} fill="#CBD1D6" opacity={0.04 + calmGlow * 0.08} filter="url(#animaticSoft)" />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill style={{background: '#171C25', opacity: endFade}} />
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: endText}}>
        <div style={{textAlign: 'center', color: '#F3F4F5'}}>
          <div style={{fontSize: 62, lineHeight: 1.16, fontWeight: 650, letterSpacing: '-1.5px'}}>Slaap kun je niet afdwingen.</div>
          <div style={{fontSize: 48, lineHeight: 1.25, fontWeight: 430, color: '#BFC5CC', marginTop: 18}}>Rust mag genoeg zijn.</div>
        </div>
      </AbsoluteFill>

      <div style={{position: 'absolute', top: 42, left: 52, color: '#C5CAD0', opacity: 0.54, fontSize: 18, fontWeight: 700, letterSpacing: '2.2px'}}>
        ANIMATIC · VERHAAL EN TIMING
      </div>
    </AbsoluteFill>
  );
};
