import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_INTERCEPTOR } from '@nestjs/core'
import configuration from './config/configuration'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { PathsModule } from './paths/paths.module'
import { LessonsModule } from './lessons/lessons.module'
import { ProgressModule } from './progress/progress.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { AdminModule } from './admin/admin.module'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    PathsModule,
    LessonsModule,
    ProgressModule,
    DashboardModule,
    AdminModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
