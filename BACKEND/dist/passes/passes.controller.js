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
exports.PassesController = void 0;
const common_1 = require("@nestjs/common");
const passes_service_1 = require("./passes.service");
const create_pass_dto_1 = require("./dto/create-pass.dto");
const update_pass_dto_1 = require("./dto/update-pass.dto");
const common_2 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const role_guard_1 = require("../auth/guard/role.guard");
const login_dto_1 = require("../auth/dto/login.dto");
const roles_decorator_1 = require("../auth/guard/roles.decorator");
let PassesController = class PassesController {
    constructor(passesService) {
        this.passesService = passesService;
    }
    async getAll() {
        return await this.passesService.getAllPasses();
    }
    async getByHostel(id) {
        return await this.passesService.getByHostel(id);
    }
    async getByStatus(status) {
        return await this.passesService.getByStatus(status);
    }
    async getMyPasses(req) {
        return await this.passesService.getMyPasses(req.user.email);
    }
    async getByHostelStatus(id, status) {
        return await this.passesService.getByHostelStatus(id, status);
    }
    async getPassActions() {
        return await this.passesService.getPassActions();
    }
    async createPass(createPass, req) {
        return await this.passesService.createPass(createPass, req.user.email);
    }
    async cancelPass(id, req) {
        return await this.passesService.cancelPass(id, req.user.email);
    }
    async approveParent(id) {
        return await this.passesService.approveParent(id);
    }
    async approveCaretaker(id, req) {
        return await this.passesService.approveCaretaker(id, req.user.email);
    }
    async checkin(id, req) {
        return await this.passesService.checkin(id, req.user.email);
    }
    async checkout(id, req) {
        return await this.passesService.checkout(id, req.user.email);
    }
};
exports.PassesController = PassesController;
__decorate([
    (0, common_1.Get)("getAllPasses"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("getByHostel/:id"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN, login_dto_1.UserRole.CARETAKER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "getByHostel", null);
__decorate([
    (0, common_1.Get)("getByStatus/:status"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN, login_dto_1.UserRole.CARETAKER),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "getByStatus", null);
__decorate([
    (0, common_1.Get)("getMyPasses"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.STUDENT),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "getMyPasses", null);
__decorate([
    (0, common_1.Get)("getByHostelStatus/:id/:status"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN, login_dto_1.UserRole.CARETAKER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "getByHostelStatus", null);
__decorate([
    (0, common_1.Get)("getPassActions"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "getPassActions", null);
__decorate([
    (0, common_1.Post)("createPass"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.STUDENT),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pass_dto_1.CreatePassDto, Object]),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "createPass", null);
__decorate([
    (0, common_1.Put)("cancelPass/:id"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.STUDENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "cancelPass", null);
__decorate([
    (0, common_1.Put)("approveParent/:id"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.PARENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "approveParent", null);
__decorate([
    (0, common_1.Put)("approveCaretaker/:id"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.CARETAKER, login_dto_1.UserRole.WARDEN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "approveCaretaker", null);
__decorate([
    (0, common_1.Put)("Checkin/:id"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.SECURITY),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "checkin", null);
__decorate([
    (0, common_1.Put)("Checkout/:id"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.SECURITY),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PassesController.prototype, "checkout", null);
exports.PassesController = PassesController = __decorate([
    (0, common_2.UseGuards)(jwt_guard_1.JwtGuard, role_guard_1.RolesGuard),
    (0, common_1.Controller)('Passes'),
    __metadata("design:paramtypes", [passes_service_1.PassesService])
], PassesController);
