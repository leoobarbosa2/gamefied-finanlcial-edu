import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            createdAt: Date;
            email: string;
            displayName: string;
            dailyGoalMins: number;
            role: import("@prisma/client").$Enums.UserRole;
            plan: import("@prisma/client").$Enums.UserPlan;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            displayName: string;
            dailyGoalMins: number;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            plan: import("@prisma/client").$Enums.UserPlan;
        };
    }>;
    getMe(userId: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        displayName: string;
        avatarUrl: string | null;
        dailyGoalMins: number;
        role: import("@prisma/client").$Enums.UserRole;
        plan: import("@prisma/client").$Enums.UserPlan;
        streak: {
            currentStreak: number;
            longestStreak: number;
            lastActivityAt: Date | null;
        } | null;
    } | null>;
    private generateTokens;
    refreshTokens(refreshToken: string): {
        accessToken: string;
        refreshToken: string;
    };
}
