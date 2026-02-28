import { IsString, IsBoolean, IsInt, IsOptional, Min, MinLength } from 'class-validator'

export class CreateOptionDto {
  @IsString()
  @MinLength(1)
  text: string

  @IsBoolean()
  isCorrect: boolean

  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number
}
