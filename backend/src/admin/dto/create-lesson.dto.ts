import { IsString, IsBoolean, IsOptional, IsInt, Min } from 'class-validator'

export class CreateLessonDto {
  @IsString() title: string
  @IsString() @IsOptional() description?: string
  @IsInt() @Min(0) orderIndex: number
  @IsInt() @Min(1) @IsOptional() estimatedMins?: number
  @IsBoolean() @IsOptional() isPublished?: boolean
}
