import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        dailyGoalMins: true,
        createdAt: true,
        streak: {
          select: {
            currentStreak: true,
            longestStreak: true,
            lastActivityAt: true,
          },
        },
      },
    })
  }

  async update(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        dailyGoalMins: true,
      },
    })
  }

  async delete(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } })
    return { message: 'Account deleted' }
  }
}
