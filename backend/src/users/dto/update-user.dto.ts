import { IsString, IsOptional, IsUrl, IsInt, Min, Max, MinLength, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  displayName?: string

  @IsOptional()
  @IsUrl()
  avatarUrl?: string

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(120)
  @Type(() => Number)
  dailyGoalMins?: number
}
