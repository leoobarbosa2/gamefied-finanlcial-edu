// Design tokens extracted from frontend/src/index.css
// Used in React Native components where CSS vars are not available

export const lightColors = {
  surface:          '#ffffff',
  surfaceRaised:    '#f9fafb',
  surfaceOverlay:   '#f3f4f6',
  contentPrimary:   '#09090b',
  contentSecondary: '#3f3f46',
  contentMuted:     '#71717a',
  contentInverse:   '#ffffff',
  border:           '#e4e4e7',
  borderStrong:     '#d4d4d8',
  successSubtle:    '#f0fdf4',
  success:          '#16a34a',
  successStrong:    '#15803d',
  errorSubtle:      '#fff1f2',
  error:            '#e11d48',
  errorStrong:      '#be123c',
  warningSubtle:    '#fffbeb',
  warning:          '#d97706',
}

export const darkColors = {
  surface:          '#1c1c22',
  surfaceRaised:    '#24242c',
  surfaceOverlay:   '#2e2e38',
  contentPrimary:   '#f4f4f5',
  contentSecondary: '#d4d4d8',
  contentMuted:     '#8b8b98',
  contentInverse:   '#16161a',
  border:           '#2a2a32',
  borderStrong:     '#3d3d4a',
  successSubtle:    '#052e16',
  success:          '#4ade80',
  successStrong:    '#86efac',
  errorSubtle:      '#4c0519',
  error:            '#fb7185',
  errorStrong:      '#fda4af',
  warningSubtle:    '#451a03',
  warning:          '#fbbf24',
}

export type ColorTokens = typeof lightColors

// Path color token mapping (for path cards)
// Gamification tokens (Duolingo-style)
export const gameColors = {
  xpFill:         '#14b8a6',   // teal — XP bar fill
  xpGlow:         '#5eead4',   // teal light — XP bar glow
  streakFire:     '#f97316',   // orange — streak flame
  streakFireGlow: '#fed7aa',   // peach — flame halo
  coinGold:       '#f59e0b',   // amber — coin
  coinGoldLight:  '#fef3c7',   // amber light — coin bg
  levelShield:    '#6366f1',   // indigo — level badge
  levelShieldEnd: '#4f46e5',   // indigo dark — gradient end
  levelBorder:    '#f59e0b',   // amber — level badge border
  correct:        '#22c55e',   // green — correct answer
  incorrect:      '#ef4444',   // red — wrong answer
  confetti:       ['#14b8a6', '#f59e0b', '#6366f1', '#22c55e', '#f97316', '#ffffff'],
  shadowTeal:     'rgba(20,184,166,0.4)',
  shadowDark:     'rgba(0,0,0,0.25)',
}

export const pathColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  teal:   { bg: '#f0fdfa', text: '#0d9488', darkBg: '#134e4a', darkText: '#5eead4' },
  indigo: { bg: '#eef2ff', text: '#4f46e5', darkBg: '#1e1b4b', darkText: '#a5b4fc' },
  amber:  { bg: '#fffbeb', text: '#d97706', darkBg: '#451a03', darkText: '#fcd34d' },
  rose:   { bg: '#fff1f2', text: '#e11d48', darkBg: '#4c0519', darkText: '#fda4af' },
  violet: { bg: '#f5f3ff', text: '#7c3aed', darkBg: '#2e1065', darkText: '#c4b5fd' },
  blue:   { bg: '#eff6ff', text: '#2563eb', darkBg: '#1e3a5f', darkText: '#93c5fd' },
}
