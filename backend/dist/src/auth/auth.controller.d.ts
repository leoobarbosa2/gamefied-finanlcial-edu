import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<{
        user: {
            id: string;
            createdAt: Date;
            email: string;
            displayName: string;
            dailyGoalMins: number;
            role: import("@prisma/client").$Enums.UserRole;
            plan: import("@prisma/client").$Enums.UserPlan;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            displayName: string;
            dailyGoalMins: number;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            plan: import("@prisma/client").$Enums.UserPlan;
        };
        accessToken: string;
    }>;
    refresh(req: {
        cookies: {
            refresh_token?: string;
        };
    }, res: Response): Promise<{
        accessToken: string;
    }>;
    logout(res: Response): {
        message: string;
    };
    getMe(user: {
        id: string;
    }): Promise<{
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
    private setRefreshCookie;
}
