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
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const login_dto_1 = require("../auth/dto/login.dto");
const student_repository_1 = require("./student.repository");
const auth_repository_1 = require("../auth/auth.repository");
let StudentService = class StudentService {
    constructor(authservice, studentrepo, authrepo) {
        this.authservice = authservice;
        this.studentrepo = studentrepo;
        this.authrepo = authrepo;
    }
    async addStudent(body) {
        const existing = await this.studentrepo.findByRollNo(body.Roll_NO);
        if (existing) {
            throw new common_1.BadRequestException('Roll number already exists');
        }
        const res = await this.authservice.signup({
            Name: body.Name,
            Email: body.Email,
            PhoneNo: body.PhoneNo,
            password: body.password,
            role: login_dto_1.UserRole.STUDENT,
        });
        const userId = res.UserID;
        await this.studentrepo.addStudent({
            Roll_NO: body.Roll_NO,
            USER_ID: String(userId),
            Hostel_Id: body.Hostel_Id,
            IS_BLOCKED: false,
            DEFAULTER_Attempts: 0,
            PARENT_MAIL: body.Parent_Mail,
            PARENT_NAME: body.Parent_Name,
            ADDRESS: body.Address,
            PARENT_PHONE: body.Parent_Phone,
        });
        return { message: 'Student added successfully', userId };
    }
    async deleteStudent(RollNo) {
        const existing = await this.studentrepo.findByRollNo(RollNo);
        if (!existing) {
            throw new common_1.BadRequestException('Roll number dosent exists');
        }
        const userId = existing.USER_ID;
        await this.studentrepo.deleteStudent(RollNo);
        await this.authrepo.deleteUser(userId);
        return { message: 'Student deleted successfully' };
    }
    async updateStudent(body) {
        const existing = await this.studentrepo.findByRollNo(body.Roll_NO);
        if (!existing) {
            throw new common_1.BadRequestException('Roll number does not exist');
        }
        const userId = existing.USER_ID;
        await this.authservice.updateUser(userId, {
            Name: body.Name,
            Email: body.Email,
            PhoneNo: body.PhoneNo,
            Password: body.password,
        });
        await this.studentrepo.updateStudent(body.Roll_NO, {
            Hostel_Id: body.Hostel_Id,
            PARENT_MAIL: body.Parent_Mail,
            PARENT_NAME: body.Parent_Name,
            ADDRESS: body.Address,
            PARENT_PHONE: body.Parent_Phone,
        });
        return { message: 'Student updated successfully', };
    }
    async getAll() {
        const students = await this.studentrepo.getAllStudents();
        if (students.length === 0) {
            throw new common_1.NotFoundException('No students found');
        }
        let result = [];
        for (const student of students) {
            const user = await this.authrepo.findUserById(student.USER_ID);
            result.push({
                USER_ID: student.USER_ID,
                Roll_NO: student.Roll_NO,
                Name: user === null || user === void 0 ? void 0 : user.Name,
                Email: user === null || user === void 0 ? void 0 : user.Email,
                PhoneNo: user === null || user === void 0 ? void 0 : user.PhoneNo,
                Hostel_Id: student.Hostel_Id,
                Parent_Name: student.PARENT_NAME,
                Parent_Mail: student.PARENT_MAIL,
                Parent_Phone: student.PARENT_PHONE,
                Address: student.ADDRESS,
                IS_BLOCKED: student.IS_BLOCKED,
                DEFAULTER_Attempts: student.DEFAULTER_Attempts,
            });
        }
        return result;
    }
    async getByHostel(HostelID) {
        const students = await this.studentrepo.getByHostel(HostelID);
        if (students.length === 0) {
            throw new common_1.NotFoundException('No students found in this hostel');
        }
        let result = [];
        for (const student of students) {
            const user = await this.authrepo.findUserById(student.USER_ID);
            result.push({
                USER_ID: student.USER_ID,
                Roll_NO: student.Roll_NO,
                Name: user === null || user === void 0 ? void 0 : user.Name,
                Email: user === null || user === void 0 ? void 0 : user.Email,
                PhoneNo: user === null || user === void 0 ? void 0 : user.PhoneNo,
                Hostel_Id: student.Hostel_Id,
                Parent_Name: student.PARENT_NAME,
                Parent_Mail: student.PARENT_MAIL,
                Parent_Phone: student.PARENT_PHONE,
                Address: student.ADDRESS,
                IS_BLOCKED: student.IS_BLOCKED,
                DEFAULTER_Attempts: student.DEFAULTER_Attempts,
            });
        }
        return result;
    }
    async getMe(email) {
        const user = await this.authrepo.findUserByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const student = await this.studentrepo.findByUserId(user.USER_ID);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        return {
            USER_ID: user.USER_ID,
            Roll_NO: student.Roll_NO,
            Name: user.Name,
            Email: user.Email,
            PhoneNo: user.PhoneNo,
            Hostel_Id: student.Hostel_Id,
            Parent_Name: student.PARENT_NAME,
            Parent_Mail: student.PARENT_MAIL,
            Parent_Phone: student.PARENT_PHONE,
            Address: student.ADDRESS,
            IS_BLOCKED: student.IS_BLOCKED,
            DEFAULTER_Attempts: student.DEFAULTER_Attempts,
        };
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService, student_repository_1.StudentRepository, auth_repository_1.AuthRepository])
], StudentService);
