import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONT, NIGHT_BG } from '../shared/tokens';
import { Title, Caption, Vignette, Wordmark } from '../shared/Frame';

const PARTICLES = [
  { x: 200, y: 150, r: 3, p: 0.1 },
  { x: 320, y: 380, r: 2.5, p: 1.2 },
  { x: 720, y: 130, r: 3, p: 2.4 },
  { x: 880, y: 350, r: 2.5, p: 0.7 },
  { x: 140, y: 320, r: 2, p: 1.9 },
  { x: 980, y: 220, r: 3, p: 3.1 },
  { x: 240, y: 220, r: 2, p: 2.0 },
  { x: 800, y: 240, r: 2, p: 0.4 },
  { x: 380, y: 90,  r: 2, p: 1.5 },
  { x: 660, y: 420, r: 2.5, p: 2.7 },
];

export const BreatheScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 5 breathing cycles spread across the scene
  const cycles = 5;
  const cycleStart = fps * 1.5;
  const cycleEnd = durationInFrames - fps * 4;
  const totalCycleDur = cycleEnd - cycleStart;
  const oneCycle = totalCycleDur / cycles;

  // Determine current cycle progress
  const localFrame = frame - cycleStart;
  const cycleIdx = Math.min(Math.floor(localFrame / oneCycle), cycles - 1);
  const inCycleFrame = localFrame - cycleIdx * oneCycle;
  const cycleT = inCycleFrame / oneCycle; // 0..1

  // Inhale 0–0.4, Exhale 0.4–1.0
  const inhaleEnd = 0.4;
  let scale = 1;
  if (frame < cycleStart) {
    scale = 1; // resting before
  } else if (cycleT < inhaleEnd) {
    scale = interpolate(cycleT, [0, inhaleEnd], [1, 1.7], {
      easing: Easing.bezier(0.4, 0, 0.6, 1),
    });
  } else {
    scale = interpolate(cycleT, [inhaleEnd, 1], [1.7, 1], {
      easing: Easing.bezier(0.4, 0, 0.6, 1),
    });
  }

  // Phase indicator dot — moves left to right during inhale, right to left during exhale
  // Track from x=760 to x=1160 (centered around 960)
  const trackLeft = 760;
  const trackRight = 1160;
  let dotX = trackLeft;
  if (frame >= cycleStart) {
    if (cycleT < inhaleEnd) {
      dotX = interpolate(cycleT, [0, inhaleEnd], [trackLeft, trackRight]);
    } else {
      dotX = interpolate(cycleT, [inhaleEnd, 1], [trackRight, trackLeft]);
    }
  }

  // Glow opacity follows scale
  const glowOpacity = interpolate(scale, [1, 1.7], [0.55, 1]);

  // Ring expansions (3 rings, staggered)
  const ringScales = [0, 1, 2].map(i => {
    const phase = (cycleT + i * 0.12) % 1;
    if (phase < inhaleEnd) {
      return interpolate(phase, [0, inhaleEnd], [0.65, 1.3]);
    }
    return interpolate(phase, [inhaleEnd, 1], [1.3, 0.65]);
  });
  const ringOpacities = [0, 1, 2].map(i => {
    const phase = (cycleT + i * 0.12) % 1;
    if (phase < inhaleEnd) {
      return interpolate(phase, [0, inhaleEnd], [0, 0.55]);
    }
    return interpolate(phase, [inhaleEnd, 1], [0.55, 0]);
  });

  // Particle drift + twinkle
  const partOp = (p: number) => 0.35 + 0.40 * (0.5 + 0.5 * Math.sin(frame * 0.06 + p));
  const partY = (p: number) => -8 * Math.sin(frame * 0.04 + p);

  // Phase label
  const phaseLabel = frame < cycleStart ? '' : (cycleT < inhaleEnd ? 'IN' : 'UIT');

  return (
    <AbsoluteFill style={{ background: NIGHT_BG, fontFamily: FONT, color: '#fff' }}>
      <Vignette opacity={0.18} />
      {/* Ambient particles */}
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x, top: p.y + partY(p.p),
          width: p.r * 4, height: p.r * 4, borderRadius: '50%',
          background: COLORS.cyan, opacity: partOp(p.p),
          filter: 'blur(0.5px)',
        }} />
      ))}
      {/* Outer rings */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {ringScales.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 540, height: 540, borderRadius: '50%',
            border: `${i === 0 ? 4 : i === 1 ? 3 : 2}px solid ${i === 0 ? COLORS.teal : i === 1 ? COLORS.cyanSoft : COLORS.cyan}`,
            transform: `scale(${s})`,
            opacity: ringOpacities[i],
          }} />
        ))}
      </AbsoluteFill>
      {/* Glow halo */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(160,232,237,.85) 35%, rgba(48,181,190,.55) 70%, rgba(24,64,160,0) 100%)',
          transform: `scale(${scale * 1.15})`,
          opacity: glowOpacity,
          filter: 'blur(28px)',
        }} />
      </AbsoluteFill>
      {/* Center orb */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(160,232,237,.85) 40%, rgba(48,181,190,.5) 80%, rgba(24,64,160,0) 100%)',
          transform: `scale(${scale})`,
          boxShadow: '0 0 80px rgba(160,232,237,.4)',
        }} />
      </AbsoluteFill>
      {/* Phase track */}
      <div style={{
        position: 'absolute', left: trackLeft, top: 880,
        width: trackRight - trackLeft, height: 4,
        borderRadius: 2,
        background: 'rgba(160,232,237,.3)',
      }} />
      <div style={{
        position: 'absolute', left: dotX - 8, top: 872,
        width: 20, height: 20, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 0 16px rgba(255,255,255,.7)',
      }} />
      <div style={{
        position: 'absolute', top: 920, width: '100%', textAlign: 'center',
        fontSize: 28, fontWeight: 800, letterSpacing: 8,
        color: COLORS.cyan, opacity: 0.85, fontFamily: FONT,
      }}>
        {phaseLabel}
      </div>
      <Title text="Adem rustig in" />
      <Caption text="Adem langer uit. Je lichaam volgt." fadeInAt={fps * 4} />
      <Wordmark />
    </AbsoluteFill>
  );
};
