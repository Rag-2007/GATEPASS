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
exports.HostelController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const role_guard_1 = require("../auth/guard/role.guard");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const roles_decorator_1 = require("../auth/guard/roles.decorator");
const login_dto_1 = require("../auth/dto/login.dto");
const hostel_service_1 = require("./hostel.service");
const addhostel_dto_1 = require("./dto/addhostel.dto");
let HostelController = class HostelController {
    constructor(hostelservice) {
        this.hostelservice = hostelservice;
    }
    async addHostel(Hostel) {
        return this.hostelservice.addHostel(Hostel);
    }
    async deleteHostel(HostelID) {
        return this.hostelservice.deleteHostel(HostelID);
    }
    async updateHostel(Hostel) {
        return this.hostelservice.updateHostel(Hostel);
    }
    async getAllHostels() {
        return this.hostelservice.getAllHostels();
    }
    async getMe(req) {
        const email = req.user.email;
        const role = req.user.role;
        return this.hostelservice.getMe(email, role);
    }
};
exports.HostelController = HostelController;
__decorate([
    (0, common_1.Post)('/addHostel'),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addhostel_dto_1.AddHostelBlockDto]),
    __metadata("design:returntype", Promise)
], HostelController.prototype, "addHostel", null);
__decorate([
    (0, common_1.Delete)('/deleteHostel/:hostelId'),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN),
    __param(0, (0, common_1.Param)('hostelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HostelController.prototype, "deleteHostel", null);
__decorate([
    (0, common_1.Put)('/updateHostel'),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addhostel_dto_1.AddHostelBlockDto]),
    __metadata("design:returntype", Promise)
], HostelController.prototype, "updateHostel", null);
__decorate([
    (0, common_1.Get)('/getAllHostels'),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN, login_dto_1.UserRole.CARETAKER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HostelController.prototype, "getAllHostels", null);
__decorate([
    (0, common_1.Get)('/getMe'),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.WARDEN, login_dto_1.UserRole.CARETAKER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HostelController.prototype, "getMe", null);
exports.HostelController = HostelController = __decorate([
    (0, common_2.UseGuards)(jwt_guard_1.JwtGuard, role_guard_1.RolesGuard),
    (0, common_1.Controller)('hostel'),
    __metadata("design:paramtypes", [hostel_service_1.HostelService])
], HostelController);
