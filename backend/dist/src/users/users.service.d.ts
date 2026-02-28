import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        displayName: string;
        avatarUrl: string | null;
        dailyGoalMins: number;
        streak: {
            currentStreak: number;
            longestStreak: number;
            lastActivityAt: Date | null;
        } | null;
    } | null>;
    update(userId: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        displayName: string;
        avatarUrl: string | null;
        dailyGoalMins: number;
    }>;
    delete(userId: string): Promise<{
        message: string;
    }>;
}
