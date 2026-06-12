import { Injectable } from "@nestjs/common";
import { promises as fs } from 'fs';
import * as path from 'path';

export interface Student {
    Roll_NO: string;
    USER_ID: string;
    Hostel_Id: string;
    IS_BLOCKED: boolean;
    DEFAULTER_Attempts: number;
    PARENT_MAIL: string;
    PARENT_NAME: string;
    ADDRESS: string;
    PARENT_PHONE: string;
}

@Injectable()
export class StudentRepository {

    private filePath = path.join(
        process.cwd(),
        'database',
        'students.json',
    );

    private async readStudents(): Promise<Student[]> {
        const data = await fs.readFile(
            this.filePath,
            'utf-8',
        );

        return JSON.parse(data);
    }

    private async writeStudents(students: Student[]) {
        await fs.writeFile(
            this.filePath,
            JSON.stringify(students, null, 2),
        );
    }

    async addStudent(student: Student) {
        const students = await this.readStudents();
        students.push(student);
        await this.writeStudents(students);
    }

    async findByRollNo(rollNo: string) {
        const students = await this.readStudents();
        return students.find(
            s => s.Roll_NO === rollNo,
        );
    }

    async deleteStudent(rollNo: string) {
        const students = await this.readStudents();
        const updated = students.filter(
            s => s.Roll_NO !== rollNo,
        );
        await this.writeStudents(updated);
    }

    async getAllStudents() {
        return await this.readStudents();
    }

    async getByHostel(hostelId: string) {
        const students = await this.readStudents();
        return students.filter(
            s => s.Hostel_Id === hostelId,
        );
    }

    async updateStudent(rollNo: string,updatedData: Partial<Student>){
        const students = await this.readStudents();
        const index = students.findIndex(
            s => s.Roll_NO === rollNo,
        );
        if (index === -1) {
            return null;
        }
        students[index] = {...students[index],...updatedData};
        await this.writeStudents(students);
        return students[index];
    }

    async findByUserId(userId: string) {
        const students = await this.readStudents();
        return students.find(
            s => s.USER_ID === userId,
        );
    }

    async updateBlockedStatus(rollNo: string, isBlocked: boolean) {
        const students = await this.readStudents();
        const index = students.findIndex(
            s => s.Roll_NO === rollNo,
        );
        if (index === -1) {
            return null;
        }
        students[index].IS_BLOCKED = isBlocked;
        await this.writeStudents(students);
    }
    
    async incrementDefaulterAttempts(rollNo: string) {
        const students = await this.readStudents();
        const index = students.findIndex(
            s => s.Roll_NO === rollNo,
        );
        if (index === -1) {
            return null;
        }
        students[index].DEFAULTER_Attempts += 1;
        await this.writeStudents(students);
    }

    async resetDefaulterAttempts(rollNo: string) {
        const students = await this.readStudents();
        const index = students.findIndex(
            s => s.Roll_NO === rollNo,
        );
        if (index === -1) {
            return null;
        }
        students[index].DEFAULTER_Attempts = 0;
        await this.writeStudents(students);
    }

}