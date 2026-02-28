import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
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

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('metrics')
  getMetrics() {
    return this.adminService.getMetrics()
  }

  // ── Paths ──────────────────────────────────────────────────────────────

  @Get('paths')
  findAllPaths() {
    return this.adminService.findAllPaths()
  }

  @Post('paths')
  createPath(@Body() dto: CreatePathDto) {
    return this.adminService.createPath(dto)
  }

  @Patch('paths/:id')
  updatePath(@Param('id') id: string, @Body() dto: UpdatePathDto) {
    return this.adminService.updatePath(id, dto)
  }

  @Delete('paths/:id')
  @HttpCode(HttpStatus.OK)
  deletePath(@Param('id') id: string) {
    return this.adminService.deletePath(id)
  }

  // ── Lessons ────────────────────────────────────────────────────────────

  @Get('paths/:id/lessons')
  findLessons(@Param('id') pathId: string) {
    return this.adminService.findLessonsByPath(pathId)
  }

  @Post('paths/:id/lessons')
  createLesson(@Param('id') pathId: string, @Body() dto: CreateLessonDto) {
    return this.adminService.createLesson(pathId, dto)
  }

  @Patch('lessons/:id')
  updateLesson(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.adminService.updateLesson(id, dto)
  }

  @Delete('lessons/:id')
  @HttpCode(HttpStatus.OK)
  deleteLesson(@Param('id') id: string) {
    return this.adminService.deleteLesson(id)
  }

  // ── Steps ──────────────────────────────────────────────────────────────

  @Get('lessons/:id/steps')
  findSteps(@Param('id') lessonId: string) {
    return this.adminService.findStepsByLesson(lessonId)
  }

  @Post('lessons/:id/steps')
  createStep(@Param('id') lessonId: string, @Body() dto: CreateStepDto) {
    return this.adminService.createStep(lessonId, dto)
  }

  @Patch('steps/:id')
  updateStep(@Param('id') id: string, @Body() dto: UpdateStepDto) {
    return this.adminService.updateStep(id, dto)
  }

  @Delete('steps/:id')
  @HttpCode(HttpStatus.OK)
  deleteStep(@Param('id') id: string) {
    return this.adminService.deleteStep(id)
  }

  // ── Questions ──────────────────────────────────────────────────────────

  @Post('steps/:id/questions')
  createQuestion(@Param('id') stepId: string, @Body() dto: CreateQuestionDto) {
    return this.adminService.createQuestion(stepId, dto)
  }

  @Patch('questions/:id')
  updateQuestion(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.adminService.updateQuestion(id, dto)
  }

  @Delete('questions/:id')
  @HttpCode(HttpStatus.OK)
  deleteQuestion(@Param('id') id: string) {
    return this.adminService.deleteQuestion(id)
  }

  // ── Options ────────────────────────────────────────────────────────────

  @Post('questions/:id/options')
  createOption(@Param('id') questionId: string, @Body() dto: CreateOptionDto) {
    return this.adminService.createOption(questionId, dto)
  }

  @Patch('options/:id')
  updateOption(@Param('id') id: string, @Body() dto: UpdateOptionDto) {
    return this.adminService.updateOption(id, dto)
  }

  @Delete('options/:id')
  @HttpCode(HttpStatus.OK)
  deleteOption(@Param('id') id: string) {
    return this.adminService.deleteOption(id)
  }

  // ── Users ──────────────────────────────────────────────────────────────

  @Get('users')
  findAllUsers() {
    return this.adminService.findAllUsers()
  }

  @Patch('users/:id/plan')
  updateUserPlan(@Param('id') id: string, @Body() dto: UpdateUserPlanDto) {
    return this.adminService.updateUserPlan(id, dto)
  }
}
