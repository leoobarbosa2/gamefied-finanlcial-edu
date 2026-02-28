import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(user: {
        id: string;
    }): Promise<{
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
}
