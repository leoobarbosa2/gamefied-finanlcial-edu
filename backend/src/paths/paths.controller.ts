import { Controller, Get, Param, UseGuards, NotFoundException } from '@nestjs/common'
import { PathsService } from './paths.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@Controller('paths')
@UseGuards(JwtAuthGuard)
export class PathsController {
  constructor(private pathsService: PathsService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.pathsService.findAll(user.id)
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @CurrentUser() user: { id: string }) {
    const path = await this.pathsService.findOne(slug, user.id)
    if (!path) throw new NotFoundException('Learning path not found')
    return path
  }
}
