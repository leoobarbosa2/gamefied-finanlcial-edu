import { Controller, Post, Get, Body, UseGuards, Req, Res, HttpCode, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto)
    this.setRefreshCookie(res, result.refreshToken)
    // refreshToken also returned in body for mobile clients (Set-Cookie filtered by iOS/Android)
    return { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto)
    this.setRefreshCookie(res, result.refreshToken)
    // refreshToken also returned in body for mobile clients (Set-Cookie filtered by iOS/Android)
    return { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: { cookies: { refresh_token?: string } },
    @Body() body: { refreshToken?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    // Cookie for web, body for mobile (Set-Cookie filtered by iOS/Android OS)
    const refreshToken = req.cookies['refresh_token'] ?? body.refreshToken ?? ''
    const tokens = this.authService.refreshTokens(refreshToken)
    this.setRefreshCookie(res, tokens.refreshToken)
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token')
    return { message: 'Logged out' }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: { id: string }) {
    return this.authService.getMe(user.id)
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/v1/auth/refresh',
    })
  }
}
