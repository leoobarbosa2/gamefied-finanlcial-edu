"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LessonsService = class LessonsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(lessonId, userId) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId, isPublished: true },
            include: {
                path: { select: { id: true, slug: true, title: true } },
                steps: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        questions: {
                            include: {
                                options: {
                                    orderBy: { orderIndex: 'asc' },
                                    select: { id: true, text: true, orderIndex: true },
                                },
                            },
                        },
                    },
                },
                progress: {
                    where: { userId },
                    select: { status: true, lastStepIndex: true, score: true },
                },
            },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        return {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            estimatedMins: lesson.estimatedMins,
            path: lesson.path,
            steps: lesson.steps.map((step) => ({
                id: step.id,
                stepType: step.stepType,
                orderIndex: step.orderIndex,
                content: step.content,
                questions: step.questions.map((q) => ({
                    id: q.id,
                    questionText: q.questionText,
                    options: q.options,
                })),
            })),
            progress: lesson.progress[0] ?? null,
        };
    }
    async startLesson(lessonId, userId) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId, isPublished: true },
            select: { pathId: true },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        const existing = await this.prisma.userProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId } },
            select: { status: true },
        });
        if (!existing) {
            await this.prisma.userProgress.create({
                data: { userId, lessonId, pathId: lesson.pathId, status: 'IN_PROGRESS', startedAt: new Date() },
            });
        }
        else {
            await this.prisma.userProgress.update({
                where: { userId_lessonId: { userId, lessonId } },
                data: {
                    status: existing.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
                    startedAt: new Date(),
                },
            });
        }
        return { started: true };
    }
    async getDailyLimitStatus(userId) {
        const LIMIT = 3;
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const used = await this.prisma.userProgress.count({
            where: {
                userId,
                status: 'COMPLETED',
                completedAt: { gte: todayStart },
            },
        });
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        return {
            used,
            limit: LIMIT,
            canLearn: used < LIMIT,
            resetAt: tomorrowStart.toISOString(),
        };
    }
    async completeLesson(lessonId, userId, dto) {
        const existing = await this.prisma.userProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId } },
        });
        if (!existing)
            throw new common_1.BadRequestException('Start the lesson before completing it');
        if (existing.status !== 'COMPLETED') {
            const limit = await this.getDailyLimitStatus(userId);
            if (!limit.canLearn) {
                throw new common_1.ForbiddenException({ message: 'Limite diário atingido', code: 'DAILY_LIMIT_REACHED' });
            }
        }
        const completedAt = new Date();
        const timeSpentSecs = existing.startedAt
            ? Math.max(0, Math.floor((completedAt.getTime() - new Date(existing.startedAt).getTime()) / 1000))
            : null;
        await this.prisma.userProgress.update({
            where: { userId_lessonId: { userId, lessonId } },
            data: {
                status: 'COMPLETED',
                score: dto.score,
                completedAt,
                timeSpentSecs,
            },
        });
        await this.updateStreak(userId);
        return { completed: true };
    }
    async submitAnswer(lessonId, stepId, userId, dto) {
        const step = await this.prisma.lessonStep.findUnique({
            where: { id: stepId },
            select: { lessonId: true, stepType: true },
        });
        if (!step || step.lessonId !== lessonId)
            throw new common_1.NotFoundException('Step not found');
        if (step.stepType !== 'QUIZ')
            throw new common_1.BadRequestException('This step is not a quiz');
        const question = await this.prisma.question.findUnique({
            where: { id: dto.questionId },
            include: {
                options: {
                    select: { id: true, isCorrect: true, text: true },
                },
            },
        });
        if (!question || question.stepId !== stepId)
            throw new common_1.NotFoundException('Question not found');
        const selectedOption = question.options.find((o) => o.id === dto.selectedOptionId);
        if (!selectedOption)
            throw new common_1.BadRequestException('Option not found');
        const correctOption = question.options.find((o) => o.isCorrect);
        return {
            isCorrect: selectedOption.isCorrect,
            explanation: question.explanation,
            correctOptionId: correctOption?.id ?? null,
        };
    }
    async updateStreak(userId) {
        const streak = await this.prisma.userStreak.findUnique({ where: { userId } });
        if (!streak)
            return;
        const now = new Date();
        const lastActivity = streak.lastActivityAt;
        let newStreak = streak.currentStreak;
        if (!lastActivity) {
            newStreak = 1;
        }
        else {
            const daysSince = Math.floor((now.setHours(0, 0, 0, 0) - new Date(lastActivity).setHours(0, 0, 0, 0)) /
                (1000 * 60 * 60 * 24));
            if (daysSince === 0) {
                return;
            }
            else if (daysSince === 1) {
                newStreak = streak.currentStreak + 1;
            }
            else {
                newStreak = 1;
            }
        }
        await this.prisma.userStreak.update({
            where: { userId },
            data: {
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, streak.longestStreak),
                lastActivityAt: new Date(),
            },
        });
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map