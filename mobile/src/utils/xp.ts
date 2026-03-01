// XP formula: level n requires n² × 50 XP total
export function xpForLevel(level: number): number {
  return level * level * 50
}

// Calculate XP progress within current level (0–1)
export function xpProgress(xp: number, level: number): number {
  const currentLevelXp = xpForLevel(level - 1)
  const nextLevelXp = xpForLevel(level)
  if (nextLevelXp === currentLevelXp) return 1
  return Math.min((xp - currentLevelXp) / (nextLevelXp - currentLevelXp), 1)
}
