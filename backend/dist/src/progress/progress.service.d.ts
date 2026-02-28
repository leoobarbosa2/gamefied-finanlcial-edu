import { PrismaService } from '../prisma/prisma.service';
export declare class ProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    getSummary(userId: string): Promise<{
        totalCompleted: number;
        currentStreak: number;
        longestStreak: number;
        lastActivityAt: Date | null;
    }>;
    getStreak(userId: string): Promise<{
        currentStreak: number;
        longestStreak: number;
        lastActivityAt: Date | null;
        weekActivity: boolean[];
    }>;
    getPathProgress(userId: string, pathId: string): Promise<{
        pathId: string;
        totalLessons: number;
        completedLessons: number;
        completionPct: number;
        progress: {
            lessonId: string;
            status: import("@prisma/client").$Enums.ProgressStatus;
            score: number | null;
        }[];
    } | null>;
    getMetrics(userId: string): Promise<{
        totalCompleted: number;
        averageScore: number | null;
        totalTimeSpentSecs: number;
        weeklyCompleted: number;
    }>;
    private getWeekActivity;
}
