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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMetrics() {
        const now = new Date();
        const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const [totalUsers, totalCompleted, totalPaths, weeklyCompletions, popularPaths] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.userProgress.count({ where: { status: 'COMPLETED' } }),
            this.prisma.learningPath.count({ where: { isPublished: true } }),
            this.prisma.userProgress.count({
                where: { status: 'COMPLETED', completedAt: { gte: weekAgo } },
            }),
            this.prisma.learningPath.findMany({
                where: { isPublished: true },
                include: { _count: { select: { progress: { where: { status: 'COMPLETED' } } } } },
                orderBy: { progress: { _count: 'desc' } },
                take: 5,
            }),
        ]);
        return {
            totalUsers,
            totalCompleted,
            totalPaths,
            weeklyCompletions,
            popularPaths: popularPaths.map((p) => ({
                id: p.id,
                title: p.title,
                completions: p._count.progress,
            })),
        };
    }
    async findAllPaths() {
        const paths = await this.prisma.learningPath.findMany({
            orderBy: { orderIndex: 'asc' },
            include: {
                _count: { select: { lessons: true } },
            },
        });
        return paths.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            description: p.description,
            iconName: p.iconName,
            colorToken: p.colorToken,
            orderIndex: p.orderIndex,
            isPublished: p.isPublished,
            isPremium: p.isPremium,
            totalLessons: p._count.lessons,
        }));
    }
    async createPath(dto) {
        return this.prisma.learningPath.create({ data: dto });
    }
    async updatePath(id, dto) {
        const path = await this.prisma.learningPath.findUnique({ where: { id } });
        if (!path)
            throw new common_1.NotFoundException('Path not found');
        return this.prisma.learningPath.update({ where: { id }, data: dto });
    }
    async deletePath(id) {
        const path = await this.prisma.learningPath.findUnique({ where: { id } });
        if (!path)
            throw new common_1.NotFoundException('Path not found');
        await this.prisma.learningPath.delete({ where: { id } });
        return { deleted: true };
    }
    async findLessonsByPath(pathId) {
        const path = await this.prisma.learningPath.findUnique({ where: { id: pathId } });
        if (!path)
            throw new common_1.NotFoundException('Path not found');
        return this.prisma.lesson.findMany({
            where: { pathId },
            orderBy: { orderIndex: 'asc' },
            include: { _count: { select: { steps: true } } },
        });
    }
    async createLesson(pathId, dto) {
        const path = await this.prisma.learningPath.findUnique({ where: { id: pathId } });
        if (!path)
            throw new common_1.NotFoundException('Path not found');
        return this.prisma.lesson.create({ data: { ...dto, pathId } });
    }
    async updateLesson(id, dto) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        return this.prisma.lesson.update({ where: { id }, data: dto });
    }
    async deleteLesson(id) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        await this.prisma.lesson.delete({ where: { id } });
        return { deleted: true };
    }
    async findStepsByLesson(lessonId) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        return this.prisma.lessonStep.findMany({
            where: { lessonId },
            orderBy: { orderIndex: 'asc' },
            include: {
                questions: {
                    include: {
                        options: { orderBy: { orderIndex: 'asc' } },
                    },
                },
            },
        });
    }
    async createStep(lessonId, dto) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        return this.prisma.lessonStep.create({
            data: { lessonId, stepType: dto.stepType, orderIndex: dto.orderIndex, content: dto.content },
            include: { questions: { include: { options: { orderBy: { orderIndex: 'asc' } } } } },
        });
    }
    async updateStep(id, dto) {
        const step = await this.prisma.lessonStep.findUnique({ where: { id } });
        if (!step)
            throw new common_1.NotFoundException('Step not found');
        return this.prisma.lessonStep.update({
            where: { id },
            data: {
                ...(dto.orderIndex !== undefined && { orderIndex: dto.orderIndex }),
                ...(dto.content !== undefined && { content: dto.content }),
            },
            include: { questions: { include: { options: { orderBy: { orderIndex: 'asc' } } } } },
        });
    }
    async deleteStep(id) {
        const step = await this.prisma.lessonStep.findUnique({ where: { id } });
        if (!step)
            throw new common_1.NotFoundException('Step not found');
        await this.prisma.lessonStep.delete({ where: { id } });
        return { deleted: true };
    }
    async createQuestion(stepId, dto) {
        const step = await this.prisma.lessonStep.findUnique({ where: { id: stepId } });
        if (!step)
            throw new common_1.NotFoundException('Step not found');
        return this.prisma.question.create({
            data: { stepId, ...dto },
            include: { options: { orderBy: { orderIndex: 'asc' } } },
        });
    }
    async updateQuestion(id, dto) {
        const question = await this.prisma.question.findUnique({ where: { id } });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        return this.prisma.question.update({
            where: { id },
            data: dto,
            include: { options: { orderBy: { orderIndex: 'asc' } } },
        });
    }
    async deleteQuestion(id) {
        const question = await this.prisma.question.findUnique({ where: { id } });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        await this.prisma.question.delete({ where: { id } });
        return { deleted: true };
    }
    async createOption(questionId, dto) {
        const question = await this.prisma.question.findUnique({ where: { id: questionId } });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        const count = await this.prisma.questionOption.count({ where: { questionId } });
        return this.prisma.questionOption.create({
            data: { questionId, text: dto.text, isCorrect: dto.isCorrect, orderIndex: dto.orderIndex ?? count + 1 },
        });
    }
    async updateOption(id, dto) {
        const option = await this.prisma.questionOption.findUnique({ where: { id } });
        if (!option)
            throw new common_1.NotFoundException('Option not found');
        return this.prisma.questionOption.update({ where: { id }, data: dto });
    }
    async deleteOption(id) {
        const option = await this.prisma.questionOption.findUnique({ where: { id } });
        if (!option)
            throw new common_1.NotFoundException('Option not found');
        await this.prisma.questionOption.delete({ where: { id } });
        return { deleted: true };
    }
    async findAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                displayName: true,
                plan: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateUserPlan(id, dto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { plan: dto.plan },
            select: { id: true, email: true, displayName: true, plan: true, role: true },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map