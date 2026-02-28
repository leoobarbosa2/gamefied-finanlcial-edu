import { IsString, IsOptional, MinLength } from 'class-validator'

export class CreateQuestionDto {
  @IsString()
  @MinLength(1)
  questionText: string

  @IsOptional()
  @IsString()
  explanation?: string
}
