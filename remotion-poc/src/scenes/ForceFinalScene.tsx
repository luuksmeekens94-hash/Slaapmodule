import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const ease = (frame: number, start: number, end: number) =>
  Easing.bezier(0.42, 0, 0.18, 1)(interpolate(frame, [start, end], [0, 1], clamp));

const blinkWindow = (frame: number, start: number) => {
  const close = ease(frame, start, start + 3);
  const open = ease(frame, start + 3, start + 7);
  return close * (1 - open);
};

export const ForceFinalScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Voice starts at 1.0s and carries the story through 20.0s.
  // Tension follows “Maar hoe meer je probeert…”; release starts on “Je hoeft het nu…”.
  const tensionIn = ease(frame, 251, 410);
  const release = ease(frame, 483, 600);
  const tension = tensionIn * (1 - release);
  const calm = ease(frame, 577, 635);
  const sceneFade = ease(frame, 635, 670);
  const endText = ease(frame, 650, 680);
  const blink = Math.min(1, blinkWindow(frame, 92) + blinkWindow(frame, 362) + blinkWindow(frame, 610));

  const slowBreath = Math.sin(frame * 0.035) * 8;
  const shorterBreath = Math.sin(frame * 0.071) * 5;
  const exhale = ease(frame, 483, 545) * (1 - ease(frame, 545, 625));
  const breath = slowBreath * (1 - tension) + shorterBreath * tension + exhale * 5;
  const shoulderLift = tension * 42;
  const roomClose = tension * 24;
  const cameraPush = ease(frame, 251, 430);
  const cameraReturn = ease(frame, 483, 610);
  const cameraScale = 1 + cameraPush * 0.022 - cameraReturn * 0.018;
  const cameraY = -7 * cameraPush + 6 * cameraReturn;
  const beamRight = 1160 - tension * 155 + calm * 65;
  const beamOpacity = 0.34 - tension * 0.11 + calm * 0.08;
  const gripOpacity = tension;
  const openOpacity = 1 - tension;

  return (
    <AbsoluteFill style={{background: '#08142B', fontFamily: 'Manrope, sans-serif', overflow: 'hidden'}}>
      <Sequence from={30}>
        <Audio src={staticFile('audio/force-nono-v1.mp3')} volume={1} />
      </Sequence>

      <AbsoluteFill
        style={{
          transform: `translateY(${cameraY}px) scale(${cameraScale})`,
          opacity: 1 - sceneFade,
          transformOrigin: '68% 48%',
          willChange: 'transform',
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="nightWall" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#0C1932" />
              <stop offset="0.56" stopColor="#1A315E" />
              <stop offset="1" stopColor="#274871" />
            </linearGradient>
            <linearGradient id="nightFloor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#152947" />
              <stop offset="1" stopColor="#09172C" />
            </linearGradient>
            <linearGradient id="moonBeam" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#E8EFF8" stopOpacity=".74" />
              <stop offset="1" stopColor="#8BBBC9" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="duvet" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4E83A6" />
              <stop offset="0.48" stopColor="#326789" />
              <stop offset="1" stopColor="#1D4566" />
            </linearGradient>
            <linearGradient id="duvetLight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#A0E8ED" stopOpacity=".28" />
              <stop offset="0.62" stopColor="#A0E8ED" stopOpacity=".1" />
              <stop offset="1" stopColor="#A0E8ED" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="calmGlow">
              <stop offset="0" stopColor="#72D4D8" stopOpacity=".24" />
              <stop offset="1" stopColor="#72D4D8" stopOpacity="0" />
            </radialGradient>
            <filter id="softShadow" x="-30%" y="-30%" width="170%" height="180%">
              <feDropShadow dx="0" dy="22" stdDeviation="26" floodColor="#020814" floodOpacity=".5" />
            </filter>
            <filter id="paperTexture" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="11" />
              <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .07 0" />
            </filter>
            <filter id="blur24"><feGaussianBlur stdDeviation="24" /></filter>
            <clipPath id="roomClip">
              <path d={`M${80 + roomClose} 0 H${1840 - roomClose} V1080 H${80 + roomClose}Z`} />
            </clipPath>
          </defs>

          <g clipPath="url(#roomClip)">
            <rect width="1920" height="1080" fill="url(#nightWall)" />
            <circle cx="1510" cy="246" r={230 + calm * 48} fill="url(#calmGlow)" opacity={0.24 + calm * 0.42} />
            <rect y="770" width="1920" height="310" fill="url(#nightFloor)" />
            <path d="M0 770 C380 742 700 792 1030 762 C1390 730 1650 768 1920 730 V820 H0Z" fill="#203A5A" opacity=".42" />

            {/* Window and outside night */}
            <g transform={`translate(${roomClose * 0.45} 0)`}>
              <path d="M196 126 H532 V486 H196Z" fill="#071326" stroke="#5F7CA1" strokeWidth="7" />
              <rect x="214" y="144" width="300" height="324" fill="#0B1930" />
              <path d="M362 144 V468 M214 308 H514" fill="none" stroke="#4D6789" strokeWidth="5" opacity=".65" />
              <circle cx="326" cy="236" r="72" fill="#F1E8C6" opacity=".94" />
              <circle cx="359" cy="210" r="75" fill="#0B1930" />
              {[245, 425, 472].map((x, i) => (
                <circle key={x} cx={x} cy={190 + i * 66} r={3 + i} fill="#D6E7F4" opacity={0.42 + i * 0.12} />
              ))}
            </g>

            <path
              d={`M236 486 L${470 + roomClose * 0.25} 486 L${beamRight} 924 L566 924Z`}
              fill="url(#moonBeam)"
              opacity={beamOpacity}
            />

            {/* Sparse room objects */}
            <g opacity=".7" transform={`translate(${-roomClose * 0.3} 0)`}>
              <path d="M1502 642 H1730 V784 H1502Z" fill="#132944" />
              <path d="M1480 784 H1750" stroke="#375572" strokeWidth="9" strokeLinecap="round" />
              <path d="M1542 642 V606 Q1614 548 1687 606 V642" fill="#E8D99F" opacity={0.16 + calm * 0.12} />
              <path d="M1614 642 V566" stroke="#526B82" strokeWidth="8" />
              <ellipse cx="1614" cy="548" rx="82" ry="28" fill="#405A75" />
            </g>

            {/* Bed shadow and bed */}
            <ellipse cx="1005" cy="935" rx="670" ry="70" fill="#020812" opacity=".48" filter="url(#blur24)" />
            <path d="M272 755 Q272 716 316 716 H1598 Q1644 716 1644 760 V916 Q1644 953 1604 953 H316 Q272 953 272 912Z" fill="#142B47" stroke="#496784" strokeWidth="6" filter="url(#softShadow)" />
            <path d="M302 748 H1614 V908 H302Z" fill="#234968" opacity=".78" />

            {/* Pillow compresses slightly as the shoulder rises. */}
            <path
              d={`M346 664 Q366 ${590 + shoulderLift * 0.08} 516 ${586 + shoulderLift * 0.1} Q676 ${580 + shoulderLift * 0.12} 724 ${648 + shoulderLift * 0.2} L703 759 Q530 ${735 + shoulderLift * 0.08} 350 754 Q319 710 346 664Z`}
              fill="#E3E8E8"
              stroke="#AABFCB"
              strokeWidth="6"
            />
            <path d={`M382 ${684 + shoulderLift * 0.08} Q510 ${640 + shoulderLift * 0.14} 670 ${674 + shoulderLift * 0.18}`} fill="none" stroke="#B6C9D2" strokeWidth="5" opacity=".62" />

            {/* Character — adult side profile with visible awake eye */}
            <g transform={`translate(0 ${-shoulderLift * 0.18})`}>
              <path
                d="M580 628 C576 566 610 516 671 497 C733 478 801 501 827 549 C838 569 837 587 830 599 L848 610 L830 621 C829 651 806 678 771 690 C729 704 680 688 646 662 C619 649 598 639 580 628Z"
                fill="#A8755F"
              />
              <path
                d="M570 616 C565 548 602 486 675 469 C747 452 817 486 844 545 C803 516 746 517 710 540 C669 566 647 611 645 661 C616 650 589 634 570 616Z"
                fill="#111D31"
              />
              <path d="M769 581 Q789 570 808 584" fill="none" stroke="#5C3C39" strokeWidth="6" strokeLinecap="round" transform={`rotate(${-tension * 7} 788 582)`} />
              {blink > 0.1 ? (
                <path d="M770 606 Q787 610 804 605" fill="none" stroke="#342A2C" strokeWidth="5" strokeLinecap="round" />
              ) : (
                <g>
                  <path d={`M770 607 Q787 ${598 - tension * 4} 804 606 Q787 ${611 + tension} 770 607Z`} fill="#292427" />
                  <circle cx={788 + tension * 2} cy={604 - tension} r="2.3" fill="#E7D5CA" opacity=".78" />
                </g>
              )}
              <path d="M826 598 Q842 605 830 614" fill="none" stroke="#7A5148" strokeWidth="4" strokeLinecap="round" />
              <path d={`M786 645 Q808 ${646 + tension * 7} 831 641`} fill="none" stroke="#684540" strokeWidth="5" strokeLinecap="round" />
            </g>

            {/* A visible shoulder makes tension legible without a symbol. */}
            <path
              d={`M650 ${708 - shoulderLift * 0.32} C704 ${652 - shoulderLift} 816 ${645 - shoulderLift} 905 ${706 - shoulderLift * 0.58} L940 764 H635Z`}
              fill="#315F79"
              stroke="#6D9CAF"
              strokeWidth="5"
            />
            <path
              d={`M803 ${681 - shoulderLift * 0.52} C850 ${650 - shoulderLift * 0.72} 901 ${648 - shoulderLift * 0.9} 936 ${681 - shoulderLift}`}
              fill="none"
              stroke="#A8755F"
              strokeWidth="36"
              strokeLinecap="round"
            />

            {/* Duvet and breathing layers */}
            <path
              d={`M632 ${762 - shoulderLift * 0.18} C748 ${649 - shoulderLift * 0.7} 1046 ${612 - shoulderLift * 0.62} 1262 ${718 - shoulderLift * 0.24} C1384 676 1538 714 1603 786 L1603 918 H586Z`}
              fill="url(#duvet)"
              stroke="#75A6B8"
              strokeWidth="6"
            />
            <path
              d={`M654 ${752 - shoulderLift * 0.24} C835 ${669 - shoulderLift * 0.67} 1054 ${654 - shoulderLift * 0.56} 1258 ${721 - shoulderLift * 0.22}`}
              fill="none"
              stroke="url(#duvetLight)"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <path
              d={`M620 ${790 + breath} C858 ${748 + breath - shoulderLift * 0.2} 1120 ${761 + breath} 1515 ${820 + breath * 0.55}`}
              fill="none"
              stroke="#A0D6DA"
              strokeWidth="7"
              strokeLinecap="round"
              opacity={0.36 + calm * 0.14}
            />
            <path d="M1250 742 Q1370 788 1510 778" fill="none" stroke="#79A9B9" strokeWidth="5" strokeLinecap="round" opacity=".34" />

            {/* Hand remains above the duvet in both poses; deliberately understated. */}
            <g opacity={openOpacity} transform={`translate(223 ${165 - shoulderLift}) scale(.75)`}>
              <path d="M895 667 C915 651 947 653 964 669 C976 681 970 697 953 704 C932 712 907 702 895 685Z" fill="#B68068" stroke="#D2A18A" strokeWidth="3" />
              <path d="M918 674 l15 23 M932 670 l13 25 M946 671 l9 22 M957 675 l5 16" stroke="#775047" strokeWidth="4" strokeLinecap="round" opacity=".62" />
            </g>
            <g opacity={gripOpacity} transform={`translate(223 ${165 - shoulderLift}) scale(.75)`}>
              <path d="M893 668 C914 650 950 652 968 671 C981 685 974 704 954 710 C931 718 905 705 893 686Z" fill="#B68068" stroke="#D2A18A" strokeWidth="3" />
              <path d="M916 672 Q932 690 951 682 M922 683 Q939 701 958 692 M931 694 Q945 706 963 700" fill="none" stroke="#704941" strokeWidth="5" strokeLinecap="round" />
            </g>
            <path d={`M915 ${704 - shoulderLift * 0.82} Q960 ${728 - shoulderLift * 0.44} 1010 ${712 - shoulderLift * 0.38}`} fill="none" stroke="#98C8D0" strokeWidth={5 + tension * 3} strokeLinecap="round" opacity={0.3 + tension * 0.42} />

            {/* Foreground depth and pressure through space, never symbols */}
            <path d={`M0 0 H${116 + roomClose} V1080 H0Z`} fill="#050D1D" opacity={0.25 + tension * 0.2} />
            <path d={`M${1804 - roomClose} 0 H1920 V1080 H${1804 - roomClose}Z`} fill="#050D1D" opacity={0.25 + tension * 0.2} />
            <rect width="1920" height="1080" fill="#E8F0F2" filter="url(#paperTexture)" opacity=".46" style={{mixBlendMode: 'soft-light'}} />
          </g>
        </svg>
      </AbsoluteFill>

      {/* Controlled cinematic vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 54% 55%, transparent 43%, rgba(2,8,20,${0.24 + tension * 0.22}) 100%)`,
          opacity: 1 - sceneFade,
        }}
      />

      {/* End statement — the only patient text in the animation */}
      <AbsoluteFill style={{background: '#08142B', opacity: sceneFade}} />
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: endText}}>
        <div style={{textAlign: 'center', color: '#F5F7F8', transform: `translateY(${interpolate(endText, [0, 1], [12, 0])}px)`}}>
          <div style={{fontSize: 64, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-1.6px'}}>Slapen lukt niet op commando.</div>
          <div style={{fontSize: 45, lineHeight: 1.3, fontWeight: 400, color: '#A8DADF', marginTop: 20}}>Je hoeft het niet te forceren.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
