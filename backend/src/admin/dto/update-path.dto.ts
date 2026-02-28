import { IsString, IsBoolean, IsOptional, IsInt, Min } from 'class-validator'

export class UpdatePathDto {
  @IsString() @IsOptional() title?: string
  @IsString() @IsOptional() description?: string
  @IsString() @IsOptional() iconName?: string
  @IsString() @IsOptional() colorToken?: string
  @IsInt() @Min(0) @IsOptional() orderIndex?: number
  @IsBoolean() @IsOptional() isPublished?: boolean
  @IsBoolean() @IsOptional() isPremium?: boolean
}
