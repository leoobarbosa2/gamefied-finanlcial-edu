import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ProgressService } from '../progress/progress.service'

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private progressService: ProgressService
  ) {}

  async getDashboard(userId: string) {
    const [user, streakData, paths] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { displayName: true, dailyGoalMins: true },
      }),
      this.progressService.getStreak(userId),
      this.prisma.learningPath.findMany({
        where: { isPublished: true },
        orderBy: { orderIndex: 'asc' },
        take: 3,
        include: {
          _count: { select: { lessons: { where: { isPublished: true } } } },
          lessons: {
            where: { isPublished: true },
            select: {
              id: true,
              progress: {
                where: { userId },
                select: { status: true },
              },
            },
          },
        },
      }),
    ])

    // Find next lesson to continue
    const continueLesson = await this.findContinueLesson(userId)

    // Compute daily progress (lessons completed today)
    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))
    const completedToday = await this.prisma.userProgress.count({
      where: { userId, status: 'COMPLETED', completedAt: { gte: todayStart } },
    })

    const recommendedPaths = paths.map((path) => {
      const total = path._count.lessons
      const completed = path.lessons.filter((l) => l.progress[0]?.status === 'COMPLETED').length
      return {
        id: path.id,
        slug: path.slug,
        title: path.title,
        description: path.description,
        iconName: path.iconName,
        colorToken: path.colorToken,
        totalLessons: total,
        completedLessons: completed,
        completionPct: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    })

    return {
      greeting: user?.displayName ?? 'there',
      streak: streakData,
      dailyGoal: {
        targetMins: user?.dailyGoalMins ?? 10,
        completedToday,
      },
      continueLesson,
      recommendedPaths,
    }
  }

  private async findContinueLesson(userId: string) {
    // Find an in-progress lesson first
    const inProgress = await this.prisma.userProgress.findFirst({
      where: { userId, status: 'IN_PROGRESS' },
      include: {
        lesson: { select: { id: true, title: true, estimatedMins: true } },
        path: { select: { slug: true, title: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    if (inProgress) {
      return {
        lessonId: inProgress.lessonId,
        lessonTitle: inProgress.lesson.title,
        pathSlug: inProgress.path.slug,
        pathTitle: inProgress.path.title,
        estimatedMins: inProgress.lesson.estimatedMins,
      }
    }

    // Find first not-started lesson in an enrolled path
    const nextLesson = await this.prisma.userProgress.findFirst({
      where: { userId, status: 'COMPLETED' },
      include: {
        path: {
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { orderIndex: 'asc' },
              include: {
                progress: { where: { userId }, select: { status: true } },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    if (nextLesson) {
      const next = nextLesson.path.lessons.find(
        (l) => !l.progress[0] || l.progress[0].status === 'NOT_STARTED'
      )
      if (next) {
        return {
          lessonId: next.id,
          lessonTitle: next.title,
          pathSlug: nextLesson.path.slug,
          pathTitle: nextLesson.path.title,
          estimatedMins: next.estimatedMins,
        }
      }
    }

    return null
  }
}
