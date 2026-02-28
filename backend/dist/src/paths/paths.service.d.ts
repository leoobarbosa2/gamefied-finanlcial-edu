import { PrismaService } from '../prisma/prisma.service';
export declare class PathsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
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
    findOne(slug: string, userId: string): Promise<{
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
    } | null>;
}
