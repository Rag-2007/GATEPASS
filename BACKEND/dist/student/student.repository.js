"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRepository = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path = __importStar(require("path"));
let StudentRepository = class StudentRepository {
    constructor() {
        this.filePath = path.join(process.cwd(), 'database', 'students.json');
    }
    async readStudents() {
        const data = await fs_1.promises.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }
    async writeStudents(students) {
        await fs_1.promises.writeFile(this.filePath, JSON.stringify(students, null, 2));
    }
    async addStudent(student) {
        const students = await this.readStudents();
        students.push(student);
        await this.writeStudents(students);
    }
    async findByRollNo(rollNo) {
        const students = await this.readStudents();
        return students.find(s => s.Roll_NO === rollNo);
    }
    async deleteStudent(rollNo) {
        const students = await this.readStudents();
        const updated = students.filter(s => s.Roll_NO !== rollNo);
        await this.writeStudents(updated);
    }
    async getAllStudents() {
        return await this.readStudents();
    }
    async getByHostel(hostelId) {
        const students = await this.readStudents();
        return students.filter(s => s.Hostel_Id === hostelId);
    }
    async updateStudent(rollNo, updatedData) {
        const students = await this.readStudents();
        const index = students.findIndex(s => s.Roll_NO === rollNo);
        if (index === -1) {
            return null;
        }
        students[index] = Object.assign(Object.assign({}, students[index]), updatedData);
        await this.writeStudents(students);
        return students[index];
    }
    async findByUserId(userId) {
        const students = await this.readStudents();
        return students.find(s => s.USER_ID === userId);
    }
    async updateBlockedStatus(rollNo, isBlocked) {
        const students = await this.readStudents();
        const index = students.findIndex(s => s.Roll_NO === rollNo);
        if (index === -1) {
            return null;
        }
        students[index].IS_BLOCKED = isBlocked;
        await this.writeStudents(students);
    }
    async incrementDefaulterAttempts(rollNo) {
        const students = await this.readStudents();
        const index = students.findIndex(s => s.Roll_NO === rollNo);
        if (index === -1) {
            return null;
        }
        students[index].DEFAULTER_Attempts += 1;
        await this.writeStudents(students);
    }
    async resetDefaulterAttempts(rollNo) {
        const students = await this.readStudents();
        const index = students.findIndex(s => s.Roll_NO === rollNo);
        if (index === -1) {
            return null;
        }
        students[index].DEFAULTER_Attempts = 0;
        await this.writeStudents(students);
    }
};
exports.StudentRepository = StudentRepository;
exports.StudentRepository = StudentRepository = __decorate([
    (0, common_1.Injectable)()
], StudentRepository);
