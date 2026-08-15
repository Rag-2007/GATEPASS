import { Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

export interface Student {
    Roll_NO: string;
    USER_ID: string;
    Block_Id: string;
    Is_Blocked: boolean;
    DEFAULTER_Attempts: number;
    PARENT_MAIL: string;
    PARENT_NAME: string;
    ADDRESS: string;
    PARENT_PHONE: string;
}

@Injectable()
export class StudentRepository {
    constructor(private readonly prisma: PrismaService,){}

    async addStudent(student: Student) {
        return await this.prisma.student.create({
            data: {
                User_Id: student.USER_ID,
                Roll_No: student.Roll_NO,
                Block_Id: student.Block_Id,
                Is_Blocked: student.Is_Blocked,
                DEFAULTER_Attempts: student.DEFAULTER_Attempts,
                PARENT_MAIL: student.PARENT_MAIL,
                PARENT_NAME: student.PARENT_NAME,
                ADDRESS: student.ADDRESS,
                PARENT_PHONE: student.PARENT_PHONE
            }
        });
    }

    async findByRollNo(rollNo: string) {
        return await this.prisma.student.findUnique({
            where: {
                Roll_No: rollNo
            }
        });
    }

    async deleteStudent(rollNo: string) {
        return await this.prisma.student.delete({
            where: {
                Roll_No: rollNo
            }
        });
    }

    async getAllStudents() {
        return await this.prisma.student.findMany();
    }

    async getByHostel(hostelId: string) {
        return await this.prisma.student.findMany({
            where: {
                Block_Id: hostelId
            }
        });
    }

    async updateStudent(rollNo: string,updatedData: Partial<Student>){
        return await this.prisma.student.update({
            where: {
                Roll_No: rollNo
            },
            data: updatedData
        });

    }

    async findByUserId(userId: string) {
        return await this.prisma.student.findUnique({
            where: {
                User_Id: userId
            }
        });
    }

    async updateBlockedStatus(rollNo: string, isBlocked: boolean) {
        return await this.prisma.student.update({
            where: {
                Roll_No: rollNo
            },
            data: {
                Is_Blocked: isBlocked
            }
        });
    }

    async incrementDefaulterAttempts(rollNo: string) {
        return await this.prisma.student.update({
            where: {
                Roll_No: rollNo
            },
            data: {
                DEFAULTER_Attempts: { increment: 1 }
            }
        });
    }

    async resetDefaulterAttempts(rollNo: string) {
        return await this.prisma.student.update({
            where: {
                Roll_No: rollNo
            },
            data: {
                DEFAULTER_Attempts: 0
            }
        });
    }
}
