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
exports.BlockedService = void 0;
const common_1 = require("@nestjs/common");
const blocked_repository_1 = require("./blocked.repository");
const student_repository_1 = require("../student/student.repository");
let BlockedService = class BlockedService {
    constructor(blockedRepository, studentRepository) {
        this.blockedRepository = blockedRepository;
        this.studentRepository = studentRepository;
    }
    async getAllBlocked() {
        return await this.blockedRepository.getBlockedStudents();
    }
    async createBlocked(createBlockedDto) {
        const student = await this.studentRepository.findByRollNo(createBlockedDto.Roll_NO);
        if (!student) {
            throw new Error("Student not found");
        }
        if (student.IS_BLOCKED) {
            throw new Error("Student is already blocked");
        }
        if (!student.IS_BLOCKED) {
            await this.studentRepository.updateBlockedStatus(createBlockedDto.Roll_NO, true);
        }
        return await this.blockedRepository.createBlocked(createBlockedDto);
    }
    async unblockStudent(rollNo, updateBlockedDto) {
        const student = await this.studentRepository.findByRollNo(rollNo);
        if (!student) {
            throw new Error("Student not found");
        }
        if (!student.IS_BLOCKED) {
            throw new Error("Student is not currently blocked");
        }
        if (!updateBlockedDto.Blocked_Role_id) {
            throw new Error("Blocked_Role_id is required for unblocking");
        }
        await this.studentRepository.resetDefaulterAttempts(rollNo);
        await this.studentRepository.updateBlockedStatus(rollNo, false);
        return await this.blockedRepository.unblockStudent(rollNo, updateBlockedDto.Blocked_Role_id);
    }
};
exports.BlockedService = BlockedService;
exports.BlockedService = BlockedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [blocked_repository_1.BlockedRepository,
        student_repository_1.StudentRepository])
], BlockedService);
