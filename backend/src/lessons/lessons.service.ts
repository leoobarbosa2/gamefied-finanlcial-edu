import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SubmitAnswerDto } from './dto/submit-answer.dto'
import { CompleteLessonDto } from './dto/complete-lesson.dto'

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findOne(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId, isPublished: true },
      include: {
        path: { select: { id: true, slug: true, title: true } },
        steps: {
          orderBy: { orderIndex: 'asc' },
          include: {
            questions: {
              include: {
                options: {
                  orderBy: { orderIndex: 'asc' },
                  // Never expose isCorrect to the client
                  select: { id: true, text: true, orderIndex: true },
                },
              },
            },
          },
        },
        progress: {
          where: { userId },
          select: { status: true, lastStepIndex: true, score: true },
        },
      },
    })

    if (!lesson) throw new NotFoundException('Lesson not found')

    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      estimatedMins: lesson.estimatedMins,
      path: lesson.path,
      steps: lesson.steps.map((step) => ({
        id: step.id,
        stepType: step.stepType,
        orderIndex: step.orderIndex,
        content: step.content,
        questions: step.questions.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options,
        })),
      })),
      progress: lesson.progress[0] ?? null,
    }
  }

  async startLesson(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId, isPublished: true },
      select: { pathId: true },
    })
    if (!lesson) throw new NotFoundException('Lesson not found')

    const existing = await this.prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      select: { status: true },
    })

    if (!existing) {
      await this.prisma.userProgress.create({
        data: { userId, lessonId, pathId: lesson.pathId, status: 'IN_PROGRESS', startedAt: new Date() },
      })
    } else {
      // Never downgrade a COMPLETED lesson — only refresh startedAt for re-timing
      await this.prisma.userProgress.update({
        where: { userId_lessonId: { userId, lessonId } },
        data: {
          status: existing.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
          startedAt: new Date(),
        },
      })
    }

    return { started: true }
  }

  async getDailyLimitStatus(userId: string) {
    const LIMIT = 3
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)

    const [used, user] = await Promise.all([
      this.prisma.userProgress.count({
        where: { userId, status: 'COMPLETED', completedAt: { gte: todayStart } },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true, coins: true, bonusSessions: true, bonusSessionsDate: true },
      }),
    ])

    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)
    const resetAt = tomorrowStart.toISOString()

    if (user?.plan === 'PRO') {
      return {
        used,
        limit: null,
        canLearn: true,
        resetAt,
        isPro: true,
        coins: user.coins,
        bonusSessions: 0,
      }
    }

    const todayStr = todayStart.toISOString().slice(0, 10)
    const bonusSessions = user?.bonusSessionsDate === todayStr ? (user.bonusSessions ?? 0) : 0
    const effectiveLimit = LIMIT + bonusSessions

    return {
      used,
      limit: effectiveLimit,
      canLearn: used < effectiveLimit,
      resetAt,
      isPro: false,
      coins: user?.coins ?? 0,
      bonusSessions,
    }
  }

  async buyExtraSessions(userId: string) {
    const COST = 100
    const BONUS = 3

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { coins: true, bonusSessions: true, bonusSessionsDate: true },
    })
    if (!user) throw new NotFoundException('User not found')
    if (user.coins < COST) throw new BadRequestException('Coins insuficientes')

    const now = new Date()
    const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().slice(0, 10)
    const currentBonus = user.bonusSessionsDate === todayStr ? (user.bonusSessions ?? 0) : 0

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        coins: { decrement: COST },
        bonusSessions: currentBonus + BONUS,
        bonusSessionsDate: todayStr,
      },
      select: { coins: true },
    })

    return { newCoins: updated.coins, extraSessions: BONUS }
  }

  async completeLesson(lessonId: string, userId: string, dto: CompleteLessonDto) {
    const existing = await this.prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    })
    if (!existing) throw new BadRequestException('Start the lesson before completing it')

    const isFirstCompletion = existing.status !== 'COMPLETED'

    // Check daily limit (skip if already COMPLETED — allowing re-completion)
    if (isFirstCompletion) {
      const limit = await this.getDailyLimitStatus(userId)
      if (!limit.canLearn) {
        throw new ForbiddenException({ message: 'Limite diário atingido', code: 'DAILY_LIMIT_REACHED' })
      }
    }

    const completedAt = new Date()
    const timeSpentSecs =
      existing.startedAt
        ? Math.max(0, Math.floor((completedAt.getTime() - new Date(existing.startedAt).getTime()) / 1000))
        : null

    await this.prisma.userProgress.update({
      where: { userId_lessonId: { userId, lessonId } },
      data: { status: 'COMPLETED', score: dto.score, completedAt, timeSpentSecs },
    })

    // Update streak
    await this.updateStreak(userId)

    // Award XP and Coins only on first completion
    if (!isFirstCompletion) {
      return { completed: true, xpEarned: 0, coinsEarned: 0, newXp: 0, newLevel: 1, leveledUp: false }
    }

    const score = dto.score ?? 0
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true, streak: { select: { currentStreak: true } } },
    })
    if (!user) return { completed: true, xpEarned: 0, coinsEarned: 0, newXp: 0, newLevel: 1, leveledUp: false }

    const baseXp = 50
    const scoreBonus = Math.round((score / 100) * 30)
    const perfectBonus = score === 100 ? 20 : 0
    const streakBonus = (user.streak?.currentStreak ?? 0) >= 3 ? 10 : 0
    const xpEarned = baseXp + scoreBonus + perfectBonus + streakBonus

    const coinsEarned = 5 + (score === 100 ? 5 : 0)

    const newXp = user.xp + xpEarned
    const newLevel = Math.floor(Math.sqrt(newXp / 50)) + 1
    const leveledUp = newLevel > user.level

    await this.prisma.user.update({
      where: { id: userId },
      data: { xp: newXp, level: newLevel, coins: { increment: coinsEarned } },
    })

    return { completed: true, xpEarned, coinsEarned, newXp, newLevel, leveledUp }
  }

  async submitAnswer(lessonId: string, stepId: string, userId: string, dto: SubmitAnswerDto) {
    // Verify the lesson and step exist
    const step = await this.prisma.lessonStep.findUnique({
      where: { id: stepId },
      select: { lessonId: true, stepType: true },
    })
    if (!step || step.lessonId !== lessonId) throw new NotFoundException('Step not found')
    if (step.stepType !== 'QUIZ') throw new BadRequestException('This step is not a quiz')

    // Server-side answer evaluation
    const question = await this.prisma.question.findUnique({
      where: { id: dto.questionId },
      include: {
        options: {
          select: { id: true, isCorrect: true, text: true },
        },
      },
    })
    if (!question || question.stepId !== stepId) throw new NotFoundException('Question not found')

    const selectedOption = question.options.find((o) => o.id === dto.selectedOptionId)
    if (!selectedOption) throw new BadRequestException('Option not found')

    const correctOption = question.options.find((o) => o.isCorrect)

    return {
      isCorrect: selectedOption.isCorrect,
      explanation: question.explanation,
      correctOptionId: correctOption?.id ?? null,
    }
  }

  private async updateStreak(userId: string) {
    const streak = await this.prisma.userStreak.findUnique({ where: { userId } })
    if (!streak) return

    const now = new Date()
    const lastActivity = streak.lastActivityAt

    let newStreak = streak.currentStreak

    if (!lastActivity) {
      newStreak = 1
    } else {
      const daysSince = Math.floor(
        (now.setHours(0, 0, 0, 0) - new Date(lastActivity).setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      )
      if (daysSince === 0) {
        // Already active today, don't change streak
        return
      } else if (daysSince === 1) {
        newStreak = streak.currentStreak + 1
      } else {
        newStreak = 1 // streak broken
      }
    }

    await this.prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastActivityAt: new Date(),
      },
    })
  }
}
