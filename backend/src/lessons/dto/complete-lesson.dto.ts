import { IsInt, IsOptional, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

export class CompleteLessonDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  score?: number
}
