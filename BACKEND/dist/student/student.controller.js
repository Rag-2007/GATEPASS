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
exports.StudentController = void 0;
const common_1 = require("@nestjs/common");
const addstudent_dto_1 = require("./dto/addstudent.dto");
const student_service_1 = require("./student.service");
const common_2 = require("@nestjs/common");
const role_guard_1 = require("../auth/guard/role.guard");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const roles_decorator_1 = require("../auth/guard/roles.decorator");
const login_dto_1 = require("../auth/dto/login.dto");
let StudentController = class StudentController {
    constructor(studentservice) {
        this.studentservice = studentservice;
    }
    async addStudent(body) {
        return this.studentservice.addStudent(body);
    }
    async deleteStudent(RollNo) {
        return this.studentservice.deleteStudent(RollNo);
    }
    async updateStudent(body) {
        return this.studentservice.updateStudent(body);
    }
    async getAll() {
        return this.studentservice.getAll();
    }
    async getbyHostel(HostelID) {
        return this.studentservice.getByHostel(HostelID);
    }
    async getMe(req) {
        const email = req.user.email;
        return this.studentservice.getMe(email);
    }
};
exports.StudentController = StudentController;
__decorate([
    (0, common_1.Post)('/addStudent'),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.CARETAKER, login_dto_1.UserRole.WARDEN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addstudent_dto_1.AddStudentDto]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "addStudent", null);
__decorate([
    (0, common_1.Delete)('/deleteStudent/:rollno'),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.CARETAKER, login_dto_1.UserRole.WARDEN),
    __param(0, (0, common_1.Param)('rollno')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "deleteStudent", null);
__decorate([
    (0, common_1.Put)('/updateStudent'),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.CARETAKER, login_dto_1.UserRole.WARDEN, login_dto_1.UserRole.STUDENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addstudent_dto_1.AddStudentDto]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "updateStudent", null);
__decorate([
    (0, common_1.Get)('/getAll'),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.CARETAKER, login_dto_1.UserRole.WARDEN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('/getbyHostel/:hostelid'),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.CARETAKER, login_dto_1.UserRole.WARDEN),
    __param(0, (0, common_1.Param)('hostelid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "getbyHostel", null);
__decorate([
    (0, common_1.Get)('/getMe'),
    (0, roles_decorator_1.Roles)(login_dto_1.UserRole.STUDENT),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "getMe", null);
exports.StudentController = StudentController = __decorate([
    (0, common_2.UseGuards)(jwt_guard_1.JwtGuard, role_guard_1.RolesGuard),
    (0, common_1.Controller)('student'),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentController);
