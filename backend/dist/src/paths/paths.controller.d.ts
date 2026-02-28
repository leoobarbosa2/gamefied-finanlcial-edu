import { PathsService } from './paths.service';
export declare class PathsController {
    private pathsService;
    constructor(pathsService: PathsService);
    findAll(user: {
        id: string;
    }): Promise<{
        id: string;
        slug: string;
        title: string;
        description: string;
        iconName: string;
        colorToken: string;
        orderIndex: number;
        isPremium: boolean;
        totalLessons: number;
        completedLessons: number;
        completionPct: number;
    }[]>;
    findOne(slug: string, user: {
        id: string;
    }): Promise<{
        id: string;
        slug: string;
        title: string;
        description: string;
        iconName: string;
        colorToken: string;
        isPremium: boolean;
        lessons: {
            id: string;
            title: string;
            description: string | null;
            orderIndex: number;
            estimatedMins: number;
            status: import("@prisma/client").$Enums.ProgressStatus;
            score: number | null;
        }[];
    }>;
}
