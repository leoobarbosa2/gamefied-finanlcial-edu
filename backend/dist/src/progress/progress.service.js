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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProgressService = class ProgressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary(userId) {
        const [totalCompleted, streak] = await Promise.all([
            this.prisma.userProgress.count({ where: { userId, status: 'COMPLETED' } }),
            this.prisma.userStreak.findUnique({ where: { userId } }),
        ]);
        return {
            totalCompleted,
            currentStreak: streak?.currentStreak ?? 0,
            longestStreak: streak?.longestStreak ?? 0,
            lastActivityAt: streak?.lastActivityAt ?? null,
        };
    }
    async getStreak(userId) {
        const streak = await this.prisma.userStreak.findUnique({ where: { userId } });
        const weekActivity = await this.getWeekActivity(userId);
        return {
            currentStreak: streak?.currentStreak ?? 0,
            longestStreak: streak?.longestStreak ?? 0,
            lastActivityAt: streak?.lastActivityAt ?? null,
            weekActivity,
        };
    }
    async getPathProgress(userId, pathId) {
        const [path, progress] = await Promise.all([
            this.prisma.learningPath.findUnique({
                where: { id: pathId },
                include: {
                    _count: { select: { lessons: { where: { isPublished: true } } } },
                },
            }),
            this.prisma.userProgress.findMany({
                where: { userId, pathId },
                select: { lessonId: true, status: true, score: true },
            }),
        ]);
        if (!path)
            return null;
        const totalLessons = path._count.lessons;
        const completedLessons = progress.filter((p) => p.status === 'COMPLETED').length;
        const completionPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        return { pathId, totalLessons, completedLessons, completionPct, progress };
    }
    async getMetrics(userId) {
        const now = new Date();
        const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const [totalCompleted, weeklyCompleted, allProgress] = await Promise.all([
            this.prisma.userProgress.count({ where: { userId, status: 'COMPLETED' } }),
            this.prisma.userProgress.count({
                where: { userId, status: 'COMPLETED', completedAt: { gte: weekAgo } },
            }),
            this.prisma.userProgress.findMany({
                where: { userId, status: 'COMPLETED' },
                select: { score: true, timeSpentSecs: true },
            }),
        ]);
        const scores = allProgress.map((p) => p.score).filter((s) => s !== null);
        const averageScore = scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : null;
        const totalTimeSpentSecs = allProgress
            .map((p) => p.timeSpentSecs ?? 0)
            .reduce((a, b) => a + b, 0);
        return { totalCompleted, averageScore, totalTimeSpentSecs, weeklyCompleted };
    }
    async getWeekActivity(userId) {
        const days = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const start = new Date(date.setHours(0, 0, 0, 0));
            const end = new Date(date.setHours(23, 59, 59, 999));
            const count = await this.prisma.userProgress.count({
                where: {
                    userId,
                    status: 'COMPLETED',
                    completedAt: { gte: start, lte: end },
                },
            });
            days.push(count > 0);
        }
        return days;
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map