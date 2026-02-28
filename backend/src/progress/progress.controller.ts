import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ProgressService } from './progress.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get()
  getSummary(@CurrentUser() user: { id: string }) {
    return this.progressService.getSummary(user.id)
  }

  @Get('streak')
  getStreak(@CurrentUser() user: { id: string }) {
    return this.progressService.getStreak(user.id)
  }

  @Get('paths/:pathId')
  getPathProgress(@Param('pathId') pathId: string, @CurrentUser() user: { id: string }) {
    return this.progressService.getPathProgress(user.id, pathId)
  }

  @Get('metrics')
  getMetrics(@CurrentUser() user: { id: string }) {
    return this.progressService.getMetrics(user.id)
  }
}
