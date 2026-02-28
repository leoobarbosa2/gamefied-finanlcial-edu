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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const progress_service_1 = require("../progress/progress.service");
let DashboardService = class DashboardService {
    prisma;
    progressService;
    constructor(prisma, progressService) {
        this.prisma = prisma;
        this.progressService = progressService;
    }
    async getDashboard(userId) {
        const [user, streakData, paths] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: userId },
                select: { displayName: true, dailyGoalMins: true, xp: true, level: true, coins: true },
            }),
            this.progressService.getStreak(userId),
            this.prisma.learningPath.findMany({
                where: { isPublished: true },
                orderBy: { orderIndex: 'asc' },
                take: 3,
                include: {
                    _count: { select: { lessons: { where: { isPublished: true } } } },
                    lessons: {
                        where: { isPublished: true },
                        select: {
                            id: true,
                            progress: {
                                where: { userId },
                                select: { status: true },
                            },
                        },
                    },
                },
            }),
        ]);
        const continueLesson = await this.findContinueLesson(userId);
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        const completedToday = await this.prisma.userProgress.count({
            where: { userId, status: 'COMPLETED', completedAt: { gte: todayStart } },
        });
        const recommendedPaths = paths.map((path) => {
            const total = path._count.lessons;
            const completed = path.lessons.filter((l) => l.progress[0]?.status === 'COMPLETED').length;
            return {
                id: path.id,
                slug: path.slug,
                title: path.title,
                description: path.description,
                iconName: path.iconName,
                colorToken: path.colorToken,
                totalLessons: total,
                completedLessons: completed,
                completionPct: total > 0 ? Math.round((completed / total) * 100) : 0,
            };
        });
        return {
            greeting: user?.displayName ?? 'there',
            streak: streakData,
            dailyGoal: {
                targetMins: user?.dailyGoalMins ?? 10,
                completedToday,
            },
            gamification: {
                xp: user?.xp ?? 0,
                level: user?.level ?? 1,
                coins: user?.coins ?? 0,
            },
            continueLesson,
            recommendedPaths,
        };
    }
    async findContinueLesson(userId) {
        const inProgress = await this.prisma.userProgress.findFirst({
            where: { userId, status: 'IN_PROGRESS' },
            include: {
                lesson: { select: { id: true, title: true, estimatedMins: true } },
                path: { select: { slug: true, title: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
        if (inProgress) {
            return {
                lessonId: inProgress.lessonId,
                lessonTitle: inProgress.lesson.title,
                pathSlug: inProgress.path.slug,
                pathTitle: inProgress.path.title,
                estimatedMins: inProgress.lesson.estimatedMins,
            };
        }
        const nextLesson = await this.prisma.userProgress.findFirst({
            where: { userId, status: 'COMPLETED' },
            include: {
                path: {
                    include: {
                        lessons: {
                            where: { isPublished: true },
                            orderBy: { orderIndex: 'asc' },
                            include: {
                                progress: { where: { userId }, select: { status: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        if (nextLesson) {
            const next = nextLesson.path.lessons.find((l) => !l.progress[0] || l.progress[0].status === 'NOT_STARTED');
            if (next) {
                return {
                    lessonId: next.id,
                    lessonTitle: next.title,
                    pathSlug: nextLesson.path.slug,
                    pathTitle: nextLesson.path.title,
                    estimatedMins: next.estimatedMins,
                };
            }
        }
        return null;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        progress_service_1.ProgressService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map