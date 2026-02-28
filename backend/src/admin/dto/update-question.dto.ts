import { IsOptional, IsString } from 'class-validator'

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  questionText?: string

  @IsOptional()
  @IsString()
  explanation?: string
}
