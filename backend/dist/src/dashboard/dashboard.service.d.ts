import { PrismaService } from '../prisma/prisma.service';
import { ProgressService } from '../progress/progress.service';
export declare class DashboardService {
    private prisma;
    private progressService;
    constructor(prisma: PrismaService, progressService: ProgressService);
    getDashboard(userId: string): Promise<{
        greeting: string;
        streak: {
            currentStreak: number;
            longestStreak: number;
            lastActivityAt: Date | null;
            weekActivity: boolean[];
        };
        dailyGoal: {
            targetMins: number;
            completedToday: number;
        };
        gamification: {
            xp: number;
            level: number;
            coins: number;
        };
        continueLesson: {
            lessonId: string;
            lessonTitle: string;
            pathSlug: string;
            pathTitle: string;
            estimatedMins: number;
        } | null;
        recommendedPaths: {
            id: string;
            slug: string;
            title: string;
            description: string;
            iconName: string;
            colorToken: string;
            totalLessons: number;
            completedLessons: number;
            completionPct: number;
        }[];
    }>;
    private findContinueLesson;
}
