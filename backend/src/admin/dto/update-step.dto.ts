import { IsOptional, IsInt, IsObject, Min } from 'class-validator'

export class UpdateStepDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number

  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>
}
