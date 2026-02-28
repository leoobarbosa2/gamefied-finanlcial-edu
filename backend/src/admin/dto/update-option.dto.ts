import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator'

export class UpdateOptionDto {
  @IsOptional()
  @IsString()
  text?: string

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean

  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number
}
