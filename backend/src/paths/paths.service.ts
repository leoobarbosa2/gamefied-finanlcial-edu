import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PathsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const paths = await this.prisma.learningPath.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: 'asc' },
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
    })

    return paths.map((path) => {
      const totalLessons = path._count.lessons
      const completedLessons = path.lessons.filter(
        (l) => l.progress[0]?.status === 'COMPLETED'
      ).length
      const completionPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

      return {
        id: path.id,
        slug: path.slug,
        title: path.title,
        description: path.description,
        iconName: path.iconName,
        colorToken: path.colorToken,
        orderIndex: path.orderIndex,
        isPremium: path.isPremium,
        totalLessons,
        completedLessons,
        completionPct,
      }
    })
  }

  async findOne(slug: string, userId: string) {
    const path = await this.prisma.learningPath.findUnique({
      where: { slug, isPublished: true },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            orderIndex: true,
            estimatedMins: true,
            progress: {
              where: { userId },
              select: { status: true, score: true },
            },
          },
        },
      },
    })

    if (!path) return null

    const lessons = path.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      orderIndex: l.orderIndex,
      estimatedMins: l.estimatedMins,
      status: l.progress[0]?.status ?? 'NOT_STARTED',
      score: l.progress[0]?.score ?? null,
    }))

    return {
      id: path.id,
      slug: path.slug,
      title: path.title,
      description: path.description,
      iconName: path.iconName,
      colorToken: path.colorToken,
      isPremium: path.isPremium,
      lessons,
    }
  }
}
