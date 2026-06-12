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
exports.BlockedController = void 0;
const common_1 = require("@nestjs/common");
const blocked_service_1 = require("./blocked.service");
const create_blocked_dto_1 = require("./dto/create-blocked.dto");
const update_blocked_dto_1 = require("./dto/update-blocked.dto");
const common_2 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const role_guard_1 = require("../auth/guard/role.guard");
const login_dto_1 = require("../auth/dto/login.dto");
const roles_decorator_1 = require("../auth/guard/roles.decorator");
let BlockedController = class BlockedController {
    constructor(blockedService) {
        this.blockedService = blockedService;
    }
    unblockStudent(rollNo, updateBlockedDto) {
        return this.blockedService.unblockStudent(rollNo, updateBlockedDto);
    }
    blockStudent(createBlockedDto) {
        return this.blockedService.createBlocked(createBlockedDto);
    }
    getAllBlocked() {
        return this.blockedService.getAllBlocked();
    }
};
exports.BlockedController = BlockedController;
__decorate([
    (0, common_1.Put)("unblockStudent/:rollNo"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN),
    __param(0, (0, common_1.Param)('rollNo')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blocked_dto_1.UpdateBlockedDto]),
    __metadata("design:returntype", void 0)
], BlockedController.prototype, "unblockStudent", null);
__decorate([
    (0, common_1.Post)("blockStudent"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN, login_dto_1.UserRole.SECURITY, login_dto_1.UserRole.CARETAKER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blocked_dto_1.CreateBlockedDto]),
    __metadata("design:returntype", void 0)
], BlockedController.prototype, "blockStudent", null);
__decorate([
    (0, common_1.Get)("getAllBlocked"),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlockedController.prototype, "getAllBlocked", null);
exports.BlockedController = BlockedController = __decorate([
    (0, common_2.UseGuards)(jwt_guard_1.JwtGuard, role_guard_1.RolesGuard),
    (0, common_1.Controller)('Blocked'),
    __metadata("design:paramtypes", [blocked_service_1.BlockedService])
], BlockedController);
