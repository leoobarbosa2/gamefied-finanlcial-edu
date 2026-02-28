import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string) {
    const [totalCompleted, streak] = await Promise.all([
      this.prisma.userProgress.count({ where: { userId, status: 'COMPLETED' } }),
      this.prisma.userStreak.findUnique({ where: { userId } }),
    ])

    return {
      totalCompleted,
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      lastActivityAt: streak?.lastActivityAt ?? null,
    }
  }

  async getStreak(userId: string) {
    const streak = await this.prisma.userStreak.findUnique({ where: { userId } })

    // Build 7-day activity array
    const weekActivity = await this.getWeekActivity(userId)

    return {
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      lastActivityAt: streak?.lastActivityAt ?? null,
      weekActivity,
    }
  }

  async getPathProgress(userId: string, pathId: string) {
    const [path, progress] = await Promise.all([
      this.prisma.learningPath.findUnique({
        where: { id: pathId },
        include: {
          _count: { select: { lessons: { where: { isPublished: true } } } },
        },
      }),
      this.prisma.userProgress.findMany({
        where: { userId, pathId },
        select: { lessonId: true, status: true, score: true },
      }),
    ])

    if (!path) return null

    const totalLessons = path._count.lessons
    const completedLessons = progress.filter((p) => p.status === 'COMPLETED').length
    const completionPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return { pathId, totalLessons, completedLessons, completionPct, progress }
  }

  async getMetrics(userId: string) {
    const now = new Date()
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)

    const [totalCompleted, weeklyCompleted, allProgress] = await Promise.all([
      this.prisma.userProgress.count({ where: { userId, status: 'COMPLETED' } }),
      this.prisma.userProgress.count({
        where: { userId, status: 'COMPLETED', completedAt: { gte: weekAgo } },
      }),
      this.prisma.userProgress.findMany({
        where: { userId, status: 'COMPLETED' },
        select: { score: true, timeSpentSecs: true },
      }),
    ])

    const scores = allProgress.map((p) => p.score).filter((s): s is number => s !== null)
    const averageScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null

    const totalTimeSpentSecs = allProgress
      .map((p) => p.timeSpentSecs ?? 0)
      .reduce((a, b) => a + b, 0)

    return { totalCompleted, averageScore, totalTimeSpentSecs, weeklyCompleted }
  }

  private async getWeekActivity(userId: string): Promise<boolean[]> {
    const days: boolean[] = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const start = new Date(date.setHours(0, 0, 0, 0))
      const end = new Date(date.setHours(23, 59, 59, 999))

      const count = await this.prisma.userProgress.count({
        where: {
          userId,
          status: 'COMPLETED',
          completedAt: { gte: start, lte: end },
        },
      })
      days.push(count > 0)
    }

    return days
  }
}
