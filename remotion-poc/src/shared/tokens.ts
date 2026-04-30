/**
 * Shared design tokens — keep all scenes visually consistent.
 * Mirrors the CSS custom properties used in prototype/index.html.
 */
export const COLORS = {
  // Cool / night palette
  bgDeep: '#0E1C38',
  bgMid: '#1B3470',
  bgLight: '#3B5489',
  cyan: '#A0E8ED',
  cyanSoft: '#7AD8DD',
  teal: '#30B5BE',
  blue: '#1B56B8',
  navy: '#1840A0',
  // Warm
  amber: '#FBD06A',
  amberDeep: '#E0B055',
  warm: '#F08A4B',
  blush: '#F4B8B8',
  // Neutral
  cream: '#FCF1D2',
  paper: '#F4F8FE',
  paperEdge: '#D9E4F3',
  ink: '#0E1C38',
  inkSoft: '#4A5878',
  steel: '#8A9AB8',
  // Functional
  rose: '#7A2828',
  green: '#155C39',
  greenSoft: '#BFE8D1',
} as const;

export const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Plus Jakarta Sans", sans-serif';

export const NIGHT_BG = `linear-gradient(180deg, ${COLORS.bgDeep} 0%, ${COLORS.bgMid} 60%, ${COLORS.bgLight} 100%)`;
export const DAWN_BG = `linear-gradient(180deg, ${COLORS.bgMid} 0%, #7295C8 55%, ${COLORS.cream} 100%)`;
export const PAPER_BG = `linear-gradient(180deg, #F8FAFE 0%, ${COLORS.paper} 100%)`;
