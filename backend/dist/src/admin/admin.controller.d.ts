import { AdminService } from './admin.service';
import { CreatePathDto } from './dto/create-path.dto';
import { UpdatePathDto } from './dto/update-path.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { UpdateUserPlanDto } from './dto/update-user-plan.dto';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getMetrics(): Promise<{
        totalUsers: number;
        totalCompleted: number;
        totalPaths: number;
        weeklyCompletions: number;
        popularPaths: {
            id: string;
            title: string;
            completions: number;
        }[];
    }>;
    findAllPaths(): Promise<{
        id: string;
        slug: string;
        title: string;
        description: string;
        iconName: string;
        colorToken: string;
        orderIndex: number;
        isPublished: boolean;
        isPremium: boolean;
        totalLessons: number;
    }[]>;
    createPath(dto: CreatePathDto): Promise<{
        id: string;
        slug: string;
        title: string;
        description: string;
        iconName: string;
        colorToken: string;
        orderIndex: number;
        isPublished: boolean;
        isPremium: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePath(id: string, dto: UpdatePathDto): Promise<{
        id: string;
        slug: string;
        title: string;
        description: string;
        iconName: string;
        colorToken: string;
        orderIndex: number;
        isPublished: boolean;
        isPremium: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deletePath(id: string): Promise<{
        deleted: boolean;
    }>;
    findLessons(pathId: string): Promise<({
        _count: {
            steps: number;
        };
    } & {
        id: string;
        title: string;
        description: string | null;
        orderIndex: number;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        pathId: string;
        estimatedMins: number;
    })[]>;
    createLesson(pathId: string, dto: CreateLessonDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        orderIndex: number;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        pathId: string;
        estimatedMins: number;
    }>;
    updateLesson(id: string, dto: UpdateLessonDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        orderIndex: number;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        pathId: string;
        estimatedMins: number;
    }>;
    deleteLesson(id: string): Promise<{
        deleted: boolean;
    }>;
    findSteps(lessonId: string): Promise<({
        questions: ({
            options: {
                id: string;
                orderIndex: number;
                createdAt: Date;
                questionId: string;
                text: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            questionText: string;
            explanation: string | null;
            stepId: string;
        })[];
    } & {
        id: string;
        orderIndex: number;
        createdAt: Date;
        stepType: import("@prisma/client").$Enums.StepType;
        content: import("@prisma/client/runtime/library").JsonValue;
        lessonId: string;
    })[]>;
    createStep(lessonId: string, dto: CreateStepDto): Promise<{
        questions: ({
            options: {
                id: string;
                orderIndex: number;
                createdAt: Date;
                questionId: string;
                text: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            questionText: string;
            explanation: string | null;
            stepId: string;
        })[];
    } & {
        id: string;
        orderIndex: number;
        createdAt: Date;
        stepType: import("@prisma/client").$Enums.StepType;
        content: import("@prisma/client/runtime/library").JsonValue;
        lessonId: string;
    }>;
    updateStep(id: string, dto: UpdateStepDto): Promise<{
        questions: ({
            options: {
                id: string;
                orderIndex: number;
                createdAt: Date;
                questionId: string;
                text: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            questionText: string;
            explanation: string | null;
            stepId: string;
        })[];
    } & {
        id: string;
        orderIndex: number;
        createdAt: Date;
        stepType: import("@prisma/client").$Enums.StepType;
        content: import("@prisma/client/runtime/library").JsonValue;
        lessonId: string;
    }>;
    deleteStep(id: string): Promise<{
        deleted: boolean;
    }>;
    createQuestion(stepId: string, dto: CreateQuestionDto): Promise<{
        options: {
            id: string;
            orderIndex: number;
            createdAt: Date;
            questionId: string;
            text: string;
            isCorrect: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        questionText: string;
        explanation: string | null;
        stepId: string;
    }>;
    updateQuestion(id: string, dto: UpdateQuestionDto): Promise<{
        options: {
            id: string;
            orderIndex: number;
            createdAt: Date;
            questionId: string;
            text: string;
            isCorrect: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        questionText: string;
        explanation: string | null;
        stepId: string;
    }>;
    deleteQuestion(id: string): Promise<{
        deleted: boolean;
    }>;
    createOption(questionId: string, dto: CreateOptionDto): Promise<{
        id: string;
        orderIndex: number;
        createdAt: Date;
        questionId: string;
        text: string;
        isCorrect: boolean;
    }>;
    updateOption(id: string, dto: UpdateOptionDto): Promise<{
        id: string;
        orderIndex: number;
        createdAt: Date;
        questionId: string;
        text: string;
        isCorrect: boolean;
    }>;
    deleteOption(id: string): Promise<{
        deleted: boolean;
    }>;
    findAllUsers(): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        displayName: string;
        role: import("@prisma/client").$Enums.UserRole;
        plan: import("@prisma/client").$Enums.UserPlan;
    }[]>;
    updateUserPlan(id: string, dto: UpdateUserPlanDto): Promise<{
        id: string;
        email: string;
        displayName: string;
        role: import("@prisma/client").$Enums.UserRole;
        plan: import("@prisma/client").$Enums.UserPlan;
    }>;
}
