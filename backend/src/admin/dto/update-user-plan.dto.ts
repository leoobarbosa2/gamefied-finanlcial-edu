import { IsEnum } from 'class-validator'
import { UserPlan } from '@prisma/client'

export class UpdateUserPlanDto {
  @IsEnum(UserPlan) plan: UserPlan
}
