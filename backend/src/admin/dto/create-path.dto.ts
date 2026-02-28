import { IsString, IsBoolean, IsOptional, IsInt, Min } from 'class-validator'

export class CreatePathDto {
  @IsString() title: string
  @IsString() slug: string
  @IsString() description: string
  @IsString() iconName: string
  @IsString() @IsOptional() colorToken?: string
  @IsInt() @Min(0) @IsOptional() orderIndex?: number
  @IsBoolean() @IsOptional() isPublished?: boolean
  @IsBoolean() @IsOptional() isPremium?: boolean
}
