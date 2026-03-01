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
export const pathColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  teal:   { bg: '#f0fdfa', text: '#0d9488', darkBg: '#134e4a', darkText: '#5eead4' },
  indigo: { bg: '#eef2ff', text: '#4f46e5', darkBg: '#1e1b4b', darkText: '#a5b4fc' },
  amber:  { bg: '#fffbeb', text: '#d97706', darkBg: '#451a03', darkText: '#fcd34d' },
  rose:   { bg: '#fff1f2', text: '#e11d48', darkBg: '#4c0519', darkText: '#fda4af' },
  violet: { bg: '#f5f3ff', text: '#7c3aed', darkBg: '#2e1065', darkText: '#c4b5fd' },
  blue:   { bg: '#eff6ff', text: '#2563eb', darkBg: '#1e3a5f', darkText: '#93c5fd' },
}
