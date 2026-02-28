import { LessonsService } from './lessons.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { CompleteLessonDto } from './dto/complete-lesson.dto';
export declare class LessonsController {
    private lessonsService;
    constructor(lessonsService: LessonsService);
    getDailyLimit(user: {
        id: string;
    }): Promise<{
        used: number;
        limit: number;
        canLearn: boolean;
        resetAt: string;
    }>;
    findOne(id: string, user: {
        id: string;
    }): Promise<{
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
    start(id: string, user: {
        id: string;
    }): Promise<{
        started: boolean;
    }>;
    complete(id: string, user: {
        id: string;
    }, dto: CompleteLessonDto): Promise<{
        completed: boolean;
    }>;
    submitAnswer(id: string, stepId: string, user: {
        id: string;
    }, dto: SubmitAnswerDto): Promise<{
        isCorrect: boolean;
        explanation: string | null;
        correctOptionId: string | null;
    }>;
}
