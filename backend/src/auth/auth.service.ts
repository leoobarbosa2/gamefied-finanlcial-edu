import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new ConflictException('Email already in use')

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
        streak: { create: {} },
      },
      select: { id: true, email: true, displayName: true, dailyGoalMins: true, role: true, plan: true, createdAt: true },
    })

    const tokens = this.generateTokens(user.id, user.email)
    return { user, ...tokens }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    const tokens = this.generateTokens(user.id, user.email)
    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        dailyGoalMins: user.dailyGoalMins,
        avatarUrl: user.avatarUrl,
        role: user.role,
        plan: user.plan,
      },
      ...tokens,
    }
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        dailyGoalMins: true,
        role: true,
        plan: true,
        createdAt: true,
        streak: {
          select: { currentStreak: true, longestStreak: true, lastActivityAt: true },
        },
      },
    })
  }

  private generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email }
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('jwt.secret'),
      expiresIn: this.config.get('jwt.expiresIn'),
    })
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('jwt.refreshSecret'),
      expiresIn: this.config.get('jwt.refreshExpiresIn'),
    })
    return { accessToken, refreshToken }
  }

  refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('jwt.refreshSecret'),
      })
      return this.generateTokens(payload.sub, payload.email)
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
