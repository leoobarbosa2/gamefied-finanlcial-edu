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
exports.PathsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PathsService = class PathsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        const paths = await this.prisma.learningPath.findMany({
            where: { isPublished: true },
            orderBy: { orderIndex: 'asc' },
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
        });
        return paths.map((path) => {
            const totalLessons = path._count.lessons;
            const completedLessons = path.lessons.filter((l) => l.progress[0]?.status === 'COMPLETED').length;
            const completionPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
            return {
                id: path.id,
                slug: path.slug,
                title: path.title,
                description: path.description,
                iconName: path.iconName,
                colorToken: path.colorToken,
                orderIndex: path.orderIndex,
                isPremium: path.isPremium,
                totalLessons,
                completedLessons,
                completionPct,
            };
        });
    }
    async findOne(slug, userId) {
        const path = await this.prisma.learningPath.findUnique({
            where: { slug, isPublished: true },
            include: {
                lessons: {
                    where: { isPublished: true },
                    orderBy: { orderIndex: 'asc' },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        orderIndex: true,
                        estimatedMins: true,
                        progress: {
                            where: { userId },
                            select: { status: true, score: true },
                        },
                    },
                },
            },
        });
        if (!path)
            return null;
        const lessons = path.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            description: l.description,
            orderIndex: l.orderIndex,
            estimatedMins: l.estimatedMins,
            status: l.progress[0]?.status ?? 'NOT_STARTED',
            score: l.progress[0]?.score ?? null,
        }));
        return {
            id: path.id,
            slug: path.slug,
            title: path.title,
            description: path.description,
            iconName: path.iconName,
            colorToken: path.colorToken,
            isPremium: path.isPremium,
            lessons,
        };
    }
};
exports.PathsService = PathsService;
exports.PathsService = PathsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PathsService);
//# sourceMappingURL=paths.service.js.map