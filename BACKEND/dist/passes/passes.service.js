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
exports.PassesService = void 0;
const common_1 = require("@nestjs/common");
const update_pass_dto_1 = require("./dto/update-pass.dto");
const passes_repository_1 = require("./passes.repository");
const passactions_repository_1 = require("./passactions.repository");
const auth_repository_1 = require("../auth/auth.repository");
const student_repository_1 = require("../student/student.repository");
let PassesService = class PassesService {
    constructor(passesRepository, passActionsRepository, authRepository, studentRepository) {
        this.passesRepository = passesRepository;
        this.passActionsRepository = passActionsRepository;
        this.authRepository = authRepository;
        this.studentRepository = studentRepository;
    }
    async getAllPasses() {
        return await this.passesRepository.getAllPasses();
    }
    async getByHostel(id) {
        return await this.passesRepository.getByHostel(id);
    }
    async getByStatus(status) {
        return await this.passesRepository.getByStatus(status);
    }
    async getMyPasses(email) {
        const userid = await this.authRepository.findUID(email);
        if (!userid) {
            throw new Error("User not found");
        }
        const studentData = await this.studentRepository.findByUserId(userid);
        if (!studentData) {
            throw new Error("Student not found");
        }
        const rollNo = studentData.Roll_NO;
        return await this.passesRepository.getMyPasses(rollNo);
    }
    async getByHostelStatus(id, status) {
        return await this.passesRepository.getByHostelStatus(id, status);
    }
    async getPassActions() {
        return await this.passActionsRepository.getAllActions();
    }
    async createPass(CreatePass, email) {
        const userid = await this.authRepository.findUID(email);
        if (!userid) {
            throw new Error("User not found");
        }
        const studentData = await this.studentRepository.findByUserId(userid);
        if (!studentData) {
            throw new Error("Student not found");
        }
        if (studentData.IS_BLOCKED) {
            throw new Error("Student is currently blocked from raising passes");
        }
        const rollNo = studentData.Roll_NO;
        if (await this.passesRepository.IsPassActive(rollNo, CreatePass.passtype)) {
            throw new Error("Pass Already active for this student");
        }
        return await this.passesRepository.createPass(CreatePass, rollNo);
    }
    async cancelPass(id, email) {
        const found = await this.passesRepository.getPassById(id);
        if (!found) {
            throw new Error("Pass not found");
        }
        if (found.Status === update_pass_dto_1.PassStatus.CHECKEDIN || found.Status === update_pass_dto_1.PassStatus.CHECKEDOUT) {
            throw new Error("Only proccesing pass can be cancelled");
        }
        const user = await this.authRepository.findUserByEmail(email);
        const uid = user.USER_ID;
        this.passActionsRepository.createAction(id, found.RollNo, uid, "Pass Cancelled in " + found.HostelId);
        return await this.passesRepository.cancelPass(id);
    }
    async approveParent(id) {
        const found = await this.passesRepository.getPassById(id);
        if (!found) {
            throw new Error("Pass not found");
        }
        if (found.Status !== update_pass_dto_1.PassStatus.PENDING) {
            throw new Error("Only pending pass can be approved");
        }
        this.passActionsRepository.createAction(id, found.RollNo, 'Parent', "Parent Approved in " + found.HostelId);
        return await this.passesRepository.approveParent(id);
    }
    async approveCaretaker(id, email) {
        const found = await this.passesRepository.getPassById(id);
        if (!found) {
            throw new Error("Pass not found");
        }
        if (found.Status !== update_pass_dto_1.PassStatus.Parentapproved) {
            throw new Error("Parent approval required");
        }
        const user = await this.authRepository.findUserByEmail(email);
        const uid = user.USER_ID;
        this.passActionsRepository.createAction(id, found.RollNo, uid, "Caretaker Approved in " + found.HostelId);
        return await this.passesRepository.approveCaretaker(id);
    }
    async checkout(id, email) {
        const found = await this.passesRepository.getPassById(id);
        if (!found) {
            throw new Error("Pass not found");
        }
        if (found.Status !== update_pass_dto_1.PassStatus.CareTakerapproved) {
            throw new Error("Pass not approved");
        }
        const user = await this.authRepository.findUserByEmail(email);
        const uid = user.USER_ID;
        this.passActionsRepository.createAction(id, found.RollNo, uid, "Pass Checked Out at " + found.HostelId);
        return await this.passesRepository.checkout(id);
    }
    async checkin(id, email) {
        const found = await this.passesRepository.getPassById(id);
        if (!found) {
            throw new Error("Pass not found");
        }
        const expectedDateTime = new Date(`${found.Expected_Date}T${found.Expected_Time}:00`);
        const now = new Date();
        if (now > expectedDateTime) {
            await this.studentRepository.incrementDefaulterAttempts(found.RollNo);
        }
        if (found.Status !== update_pass_dto_1.PassStatus.CHECKEDOUT) {
            throw new Error("Student not checked out");
        }
        const user = await this.authRepository.findUserByEmail(email);
        const uid = user.USER_ID;
        this.passActionsRepository.createAction(id, found.RollNo, uid, "Pass Checked In at " + found.HostelId);
        return await this.passesRepository.checkin(id);
    }
};
exports.PassesService = PassesService;
exports.PassesService = PassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [passes_repository_1.PassesRepository,
        passactions_repository_1.PassActionsRepository,
        auth_repository_1.AuthRepository,
        student_repository_1.StudentRepository])
], PassesService);
