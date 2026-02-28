import { ProgressService } from './progress.service';
export declare class ProgressController {
    private progressService;
    constructor(progressService: ProgressService);
    getSummary(user: {
        id: string;
    }): Promise<{
        totalCompleted: number;
        currentStreak: number;
        longestStreak: number;
        lastActivityAt: Date | null;
    }>;
    getStreak(user: {
        id: string;
    }): Promise<{
        currentStreak: number;
        longestStreak: number;
        lastActivityAt: Date | null;
        weekActivity: boolean[];
    }>;
    getPathProgress(pathId: string, user: {
        id: string;
    }): Promise<{
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
    getMetrics(user: {
        id: string;
    }): Promise<{
        totalCompleted: number;
        averageScore: number | null;
        totalTimeSpentSecs: number;
        weeklyCompleted: number;
    }>;
}
