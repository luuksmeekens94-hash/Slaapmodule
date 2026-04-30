import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { COLORS, FONT } from './tokens';

/**
 * Wordmark in bottom-left corner.
 */
export const Wordmark: React.FC<{ color?: string }> = ({ color }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 36,
      left: 60,
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: 4,
      color: color ?? COLORS.cyan,
      opacity: 0.55,
      fontFamily: FONT,
    }}
  >
    FYSIONAIR · SLAAPMODULE
  </div>
);

/**
 * Soft circular vignette / ambient glow.
 */
export const Vignette: React.FC<{ color?: string; opacity?: number }> = ({
  color = COLORS.cyan,
  opacity = 0.10,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 55%, rgba(160,232,237,${opacity}) 0%, rgba(0,0,0,0) 55%)`,
      pointerEvents: 'none',
    }}
  />
);

/**
 * Title that fades in/out at the top of the scene.
 */
export const Title: React.FC<{
  text: string;
  startFrame?: number;
  visibleSec?: number;
  fontSize?: number;
  color?: string;
}> = ({ text, startFrame = 0, visibleSec = 2.0, fontSize = 96, color = '#FFFFFF' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inEnd = startFrame + fps * 0.6;
  const outStart = startFrame + fps * (0.6 + visibleSec);
  const outEnd = outStart + fps * 0.8;
  const opacity = interpolate(
    frame,
    [startFrame, inEnd, outStart, outEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const y = interpolate(frame, [startFrame, inEnd], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: '13%',
        width: '100%',
        textAlign: 'center',
        fontSize,
        fontWeight: 800,
        letterSpacing: 2,
        opacity,
        transform: `translateY(${y}px)`,
        color,
        textShadow: '0 4px 24px rgba(0,0,0,.25)',
        fontFamily: FONT,
      }}
    >
      {text}
    </div>
  );
};

/**
 * Caption that slides up at the end of the scene.
 */
export const Caption: React.FC<{
  text: string;
  fadeInAt: number;     // frames before end when caption starts to appear
  color?: string;
  fontSize?: number;
  bottom?: string;
}> = ({ text, fadeInAt, color = COLORS.cyan, fontSize = 56, bottom = '11%' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const start = durationInFrames - fadeInAt;
  const end = start + fps * 0.8;
  const opacity = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [start, end], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        width: '100%',
        textAlign: 'center',
        fontSize,
        fontWeight: 700,
        letterSpacing: 1,
        color,
        opacity,
        transform: `translateY(${y}px)`,
        textShadow: '0 2px 18px rgba(0,0,0,.35)',
        fontFamily: FONT,
        padding: '0 80px',
        boxSizing: 'border-box',
      }}
    >
      {text}
    </div>
  );
};
