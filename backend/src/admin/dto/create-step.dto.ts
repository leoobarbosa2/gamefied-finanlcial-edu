import { IsString, IsIn, IsInt, IsObject, Min } from 'class-validator'

export class CreateStepDto {
  @IsIn(['READ', 'QUIZ', 'REFLECT'])
  stepType: string

  @IsInt()
  @Min(1)
  orderIndex: number

  @IsObject()
  content: Record<string, unknown>
}
