import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePathDto } from './dto/create-path.dto'
import { UpdatePathDto } from './dto/update-path.dto'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { UpdateLessonDto } from './dto/update-lesson.dto'
import { UpdateUserPlanDto } from './dto/update-user-plan.dto'
import { CreateStepDto } from './dto/create-step.dto'
import { UpdateStepDto } from './dto/update-step.dto'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { CreateOptionDto } from './dto/create-option.dto'
import { UpdateOptionDto } from './dto/update-option.dto'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ── Metrics ────────────────────────────────────────────────────────────

  async getMetrics() {
    const now = new Date()
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)

    const [totalUsers, totalCompleted, totalPaths, weeklyCompletions, popularPaths] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.userProgress.count({ where: { status: 'COMPLETED' } }),
      this.prisma.learningPath.count({ where: { isPublished: true } }),
      this.prisma.userProgress.count({
        where: { status: 'COMPLETED', completedAt: { gte: weekAgo } },
      }),
      this.prisma.learningPath.findMany({
        where: { isPublished: true },
        include: { _count: { select: { progress: { where: { status: 'COMPLETED' } } } } },
        orderBy: { progress: { _count: 'desc' } },
        take: 5,
      }),
    ])

    return {
      totalUsers,
      totalCompleted,
      totalPaths,
      weeklyCompletions,
      popularPaths: popularPaths.map((p) => ({
        id: p.id,
        title: p.title,
        completions: p._count.progress,
      })),
    }
  }

  // ── Paths ──────────────────────────────────────────────────────────────

  async findAllPaths() {
    const paths = await this.prisma.learningPath.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: { select: { lessons: true } },
      },
    })
    return paths.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      iconName: p.iconName,
      colorToken: p.colorToken,
      orderIndex: p.orderIndex,
      isPublished: p.isPublished,
      isPremium: p.isPremium,
      totalLessons: p._count.lessons,
    }))
  }

  async createPath(dto: CreatePathDto) {
    return this.prisma.learningPath.create({ data: dto })
  }

  async updatePath(id: string, dto: UpdatePathDto) {
    const path = await this.prisma.learningPath.findUnique({ where: { id } })
    if (!path) throw new NotFoundException('Path not found')
    return this.prisma.learningPath.update({ where: { id }, data: dto })
  }

  async deletePath(id: string) {
    const path = await this.prisma.learningPath.findUnique({ where: { id } })
    if (!path) throw new NotFoundException('Path not found')
    await this.prisma.learningPath.delete({ where: { id } })
    return { deleted: true }
  }

  // ── Lessons ────────────────────────────────────────────────────────────

  async findLessonsByPath(pathId: string) {
    const path = await this.prisma.learningPath.findUnique({ where: { id: pathId } })
    if (!path) throw new NotFoundException('Path not found')

    return this.prisma.lesson.findMany({
      where: { pathId },
      orderBy: { orderIndex: 'asc' },
      include: { _count: { select: { steps: true } } },
    })
  }

  async createLesson(pathId: string, dto: CreateLessonDto) {
    const path = await this.prisma.learningPath.findUnique({ where: { id: pathId } })
    if (!path) throw new NotFoundException('Path not found')
    return this.prisma.lesson.create({ data: { ...dto, pathId } })
  }

  async updateLesson(id: string, dto: UpdateLessonDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } })
    if (!lesson) throw new NotFoundException('Lesson not found')
    return this.prisma.lesson.update({ where: { id }, data: dto })
  }

  async deleteLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } })
    if (!lesson) throw new NotFoundException('Lesson not found')
    await this.prisma.lesson.delete({ where: { id } })
    return { deleted: true }
  }

  // ── Steps ──────────────────────────────────────────────────────────────

  async findStepsByLesson(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) throw new NotFoundException('Lesson not found')

    return this.prisma.lessonStep.findMany({
      where: { lessonId },
      orderBy: { orderIndex: 'asc' },
      include: {
        questions: {
          include: {
            options: { orderBy: { orderIndex: 'asc' } },
          },
        },
      },
    })
  }

  async createStep(lessonId: string, dto: CreateStepDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) throw new NotFoundException('Lesson not found')
    return this.prisma.lessonStep.create({
      data: { lessonId, stepType: dto.stepType as any, orderIndex: dto.orderIndex, content: dto.content as any },
      include: { questions: { include: { options: { orderBy: { orderIndex: 'asc' } } } } },
    })
  }

  async updateStep(id: string, dto: UpdateStepDto) {
    const step = await this.prisma.lessonStep.findUnique({ where: { id } })
    if (!step) throw new NotFoundException('Step not found')
    return this.prisma.lessonStep.update({
      where: { id },
      data: {
        ...(dto.orderIndex !== undefined && { orderIndex: dto.orderIndex }),
        ...(dto.content !== undefined && { content: dto.content as any }),
      },
      include: { questions: { include: { options: { orderBy: { orderIndex: 'asc' } } } } },
    })
  }

  async deleteStep(id: string) {
    const step = await this.prisma.lessonStep.findUnique({ where: { id } })
    if (!step) throw new NotFoundException('Step not found')
    await this.prisma.lessonStep.delete({ where: { id } })
    return { deleted: true }
  }

  // ── Questions ──────────────────────────────────────────────────────────

  async createQuestion(stepId: string, dto: CreateQuestionDto) {
    const step = await this.prisma.lessonStep.findUnique({ where: { id: stepId } })
    if (!step) throw new NotFoundException('Step not found')
    return this.prisma.question.create({
      data: { stepId, ...dto },
      include: { options: { orderBy: { orderIndex: 'asc' } } },
    })
  }

  async updateQuestion(id: string, dto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({ where: { id } })
    if (!question) throw new NotFoundException('Question not found')
    return this.prisma.question.update({
      where: { id },
      data: dto,
      include: { options: { orderBy: { orderIndex: 'asc' } } },
    })
  }

  async deleteQuestion(id: string) {
    const question = await this.prisma.question.findUnique({ where: { id } })
    if (!question) throw new NotFoundException('Question not found')
    await this.prisma.question.delete({ where: { id } })
    return { deleted: true }
  }

  // ── Options ────────────────────────────────────────────────────────────

  async createOption(questionId: string, dto: CreateOptionDto) {
    const question = await this.prisma.question.findUnique({ where: { id: questionId } })
    if (!question) throw new NotFoundException('Question not found')
    const count = await this.prisma.questionOption.count({ where: { questionId } })
    return this.prisma.questionOption.create({
      data: { questionId, text: dto.text, isCorrect: dto.isCorrect, orderIndex: dto.orderIndex ?? count + 1 },
    })
  }

  async updateOption(id: string, dto: UpdateOptionDto) {
    const option = await this.prisma.questionOption.findUnique({ where: { id } })
    if (!option) throw new NotFoundException('Option not found')
    return this.prisma.questionOption.update({ where: { id }, data: dto })
  }

  async deleteOption(id: string) {
    const option = await this.prisma.questionOption.findUnique({ where: { id } })
    if (!option) throw new NotFoundException('Option not found')
    await this.prisma.questionOption.delete({ where: { id } })
    return { deleted: true }
  }

  // ── Users ──────────────────────────────────────────────────────────────

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        plan: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async updateUserPlan(id: string, dto: UpdateUserPlanDto) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
    return this.prisma.user.update({
      where: { id },
      data: { plan: dto.plan },
      select: { id: true, email: true, displayName: true, plan: true, role: true },
    })
  }
}
