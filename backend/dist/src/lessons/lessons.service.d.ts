import { PrismaService } from '../prisma/prisma.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { CompleteLessonDto } from './dto/complete-lesson.dto';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(lessonId: string, userId: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        estimatedMins: number;
        path: {
            id: string;
            slug: string;
            title: string;
        };
        steps: {
            id: string;
            stepType: import("@prisma/client").$Enums.StepType;
            orderIndex: number;
            content: import("@prisma/client/runtime/library").JsonValue;
            questions: {
                id: string;
                questionText: string;
                options: {
                    id: string;
                    orderIndex: number;
                    text: string;
                }[];
            }[];
        }[];
        progress: {
            status: import("@prisma/client").$Enums.ProgressStatus;
            score: number | null;
            lastStepIndex: number;
        };
    }>;
    startLesson(lessonId: string, userId: string): Promise<{
        started: boolean;
    }>;
    getDailyLimitStatus(userId: string): Promise<{
        used: number;
        limit: null;
        canLearn: boolean;
        resetAt: string;
        isPro: boolean;
        coins: number;
        bonusSessions: number;
    } | {
        used: number;
        limit: number;
        canLearn: boolean;
        resetAt: string;
        isPro: boolean;
        coins: number;
        bonusSessions: number;
    }>;
    buyExtraSessions(userId: string): Promise<{
        newCoins: number;
        extraSessions: number;
    }>;
    completeLesson(lessonId: string, userId: string, dto: CompleteLessonDto): Promise<{
        completed: boolean;
        xpEarned: number;
        coinsEarned: number;
        newXp: number;
        newLevel: number;
        leveledUp: boolean;
    }>;
    submitAnswer(lessonId: string, stepId: string, userId: string, dto: SubmitAnswerDto): Promise<{
        isCorrect: boolean;
        explanation: string | null;
        correctOptionId: string | null;
    }>;
    private updateStreak;
}
