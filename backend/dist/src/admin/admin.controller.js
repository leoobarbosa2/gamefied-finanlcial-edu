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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const create_path_dto_1 = require("./dto/create-path.dto");
const update_path_dto_1 = require("./dto/update-path.dto");
const create_lesson_dto_1 = require("./dto/create-lesson.dto");
const update_lesson_dto_1 = require("./dto/update-lesson.dto");
const update_user_plan_dto_1 = require("./dto/update-user-plan.dto");
const create_step_dto_1 = require("./dto/create-step.dto");
const update_step_dto_1 = require("./dto/update-step.dto");
const create_question_dto_1 = require("./dto/create-question.dto");
const update_question_dto_1 = require("./dto/update-question.dto");
const create_option_dto_1 = require("./dto/create-option.dto");
const update_option_dto_1 = require("./dto/update-option.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getMetrics() {
        return this.adminService.getMetrics();
    }
    findAllPaths() {
        return this.adminService.findAllPaths();
    }
    createPath(dto) {
        return this.adminService.createPath(dto);
    }
    updatePath(id, dto) {
        return this.adminService.updatePath(id, dto);
    }
    deletePath(id) {
        return this.adminService.deletePath(id);
    }
    findLessons(pathId) {
        return this.adminService.findLessonsByPath(pathId);
    }
    createLesson(pathId, dto) {
        return this.adminService.createLesson(pathId, dto);
    }
    updateLesson(id, dto) {
        return this.adminService.updateLesson(id, dto);
    }
    deleteLesson(id) {
        return this.adminService.deleteLesson(id);
    }
    findSteps(lessonId) {
        return this.adminService.findStepsByLesson(lessonId);
    }
    createStep(lessonId, dto) {
        return this.adminService.createStep(lessonId, dto);
    }
    updateStep(id, dto) {
        return this.adminService.updateStep(id, dto);
    }
    deleteStep(id) {
        return this.adminService.deleteStep(id);
    }
    createQuestion(stepId, dto) {
        return this.adminService.createQuestion(stepId, dto);
    }
    updateQuestion(id, dto) {
        return this.adminService.updateQuestion(id, dto);
    }
    deleteQuestion(id) {
        return this.adminService.deleteQuestion(id);
    }
    createOption(questionId, dto) {
        return this.adminService.createOption(questionId, dto);
    }
    updateOption(id, dto) {
        return this.adminService.updateOption(id, dto);
    }
    deleteOption(id) {
        return this.adminService.deleteOption(id);
    }
    findAllUsers() {
        return this.adminService.findAllUsers();
    }
    updateUserPlan(id, dto) {
        return this.adminService.updateUserPlan(id, dto);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('paths'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAllPaths", null);
__decorate([
    (0, common_1.Post)('paths'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_path_dto_1.CreatePathDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createPath", null);
__decorate([
    (0, common_1.Patch)('paths/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_path_dto_1.UpdatePathDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updatePath", null);
__decorate([
    (0, common_1.Delete)('paths/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deletePath", null);
__decorate([
    (0, common_1.Get)('paths/:id/lessons'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findLessons", null);
__decorate([
    (0, common_1.Post)('paths/:id/lessons'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_lesson_dto_1.CreateLessonDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createLesson", null);
__decorate([
    (0, common_1.Patch)('lessons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lesson_dto_1.UpdateLessonDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateLesson", null);
__decorate([
    (0, common_1.Delete)('lessons/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteLesson", null);
__decorate([
    (0, common_1.Get)('lessons/:id/steps'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findSteps", null);
__decorate([
    (0, common_1.Post)('lessons/:id/steps'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_step_dto_1.CreateStepDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createStep", null);
__decorate([
    (0, common_1.Patch)('steps/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_step_dto_1.UpdateStepDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateStep", null);
__decorate([
    (0, common_1.Delete)('steps/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteStep", null);
__decorate([
    (0, common_1.Post)('steps/:id/questions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_question_dto_1.CreateQuestionDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createQuestion", null);
__decorate([
    (0, common_1.Patch)('questions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_question_dto_1.UpdateQuestionDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Delete)('questions/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Post)('questions/:id/options'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_option_dto_1.CreateOptionDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createOption", null);
__decorate([
    (0, common_1.Patch)('options/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_option_dto_1.UpdateOptionDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateOption", null);
__decorate([
    (0, common_1.Delete)('options/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteOption", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAllUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/plan'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_plan_dto_1.UpdateUserPlanDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserPlan", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map