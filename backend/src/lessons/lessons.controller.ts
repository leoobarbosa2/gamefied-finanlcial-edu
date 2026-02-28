import { Controller, Get, Post, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { LessonsService } from './lessons.service'
import { SubmitAnswerDto } from './dto/submit-answer.dto'
import { CompleteLessonDto } from './dto/complete-lesson.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get('daily-limit')
  getDailyLimit(@CurrentUser() user: { id: string }) {
    return this.lessonsService.getDailyLimitStatus(user.id)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.lessonsService.findOne(id, user.id)
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  start(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.lessonsService.startLesson(id, user.id)
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  complete(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CompleteLessonDto
  ) {
    return this.lessonsService.completeLesson(id, user.id, dto)
  }

  @Post(':id/steps/:stepId/answer')
  @HttpCode(HttpStatus.OK)
  submitAnswer(
    @Param('id') id: string,
    @Param('stepId') stepId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: SubmitAnswerDto
  ) {
    return this.lessonsService.submitAnswer(id, stepId, user.id, dto)
  }
}
