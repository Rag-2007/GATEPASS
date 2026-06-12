import { Injectable , BadRequestException , NotFoundException } from '@nestjs/common';
import { AddStudentDto } from './dto/addstudent.dto';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../auth/dto/login.dto';
import { StudentRepository } from './student.repository';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class StudentService {
    constructor(public authservice : AuthService , public studentrepo : StudentRepository , public authrepo : AuthRepository){}

    async addStudent(body: AddStudentDto) {
        const existing = await this.studentrepo.findByRollNo(body.Roll_NO,);
        if (existing) {
            throw new BadRequestException(
                'Roll number already exists',
            );
        }
        const res = await this.authservice.signup({
            Name: body.Name,
            Email: body.Email,
            PhoneNo: body.PhoneNo,
            password: body.password,
            role : UserRole.STUDENT,
        });
        const userId = res.UserID ;
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
        return {message: 'Student added successfully',userId};
    }

    async deleteStudent(RollNo:string){
        const existing = await this.studentrepo.findByRollNo(RollNo);
        if (!existing) {
            throw new BadRequestException(
                'Roll number dosent exists',
            );
        }
        const userId = existing.USER_ID;
        await this.studentrepo.deleteStudent(RollNo);
        await this.authrepo.deleteUser(userId);
        return {message : 'Student deleted successfully'};
    }

    async updateStudent(body: AddStudentDto){
        const existing = await this.studentrepo.findByRollNo(body.Roll_NO);

        if (!existing) {
            throw new BadRequestException('Roll number does not exist');
        }

        const userId = existing.USER_ID;
        await this.authservice.updateUser(
            userId,
            {
                Name: body.Name,
                Email: body.Email,
                PhoneNo: body.PhoneNo,
                Password: body.password,
            },
        );

        await this.studentrepo.updateStudent(
            body.Roll_NO,
            {
                Hostel_Id: body.Hostel_Id,
                PARENT_MAIL: body.Parent_Mail,
                PARENT_NAME: body.Parent_Name,
                ADDRESS: body.Address,
                PARENT_PHONE: body.Parent_Phone,
            },
        );

        return {message: 'Student updated successfully',};
    }

    async getAll() {
        const students = await this.studentrepo.getAllStudents();
        if (students.length === 0) {
            throw new NotFoundException(
                'No students found',
            );
        }
        let result = [];
        for (const student of students) {
            const user = await this.authrepo.findUserById(student.USER_ID);
            result.push({
                USER_ID: student.USER_ID,
                Roll_NO: student.Roll_NO,

                Name: user?.Name,
                Email: user?.Email,
                PhoneNo: user?.PhoneNo,

                Hostel_Id: student.Hostel_Id,

                Parent_Name: student.PARENT_NAME,
                Parent_Mail: student.PARENT_MAIL,
                Parent_Phone: student.PARENT_PHONE,

                Address: student.ADDRESS,

                IS_BLOCKED: student.IS_BLOCKED,
                DEFAULTER_Attempts:
                    student.DEFAULTER_Attempts,
            });
        }
        return result;
    }

    async getByHostel(HostelID: string) {
        const students = await this.studentrepo.getByHostel(HostelID);
        if (students.length === 0) {
            throw new NotFoundException(
                'No students found in this hostel',
            );
        }
        let result = [];
        for (const student of students) {
            const user = await this.authrepo.findUserById(student.USER_ID);
            result.push({
                USER_ID: student.USER_ID,
                Roll_NO: student.Roll_NO,

                Name: user?.Name,
                Email: user?.Email,
                PhoneNo: user?.PhoneNo,

                Hostel_Id: student.Hostel_Id,

                Parent_Name: student.PARENT_NAME,
                Parent_Mail: student.PARENT_MAIL,
                Parent_Phone: student.PARENT_PHONE,

                Address: student.ADDRESS,

                IS_BLOCKED: student.IS_BLOCKED,
                DEFAULTER_Attempts:
                    student.DEFAULTER_Attempts,
            });
        }
        return result;
    }

    async getMe(email: string) {
        const user =await this.authrepo.findUserByEmail(email);
        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }
        const student =await this.studentrepo.findByUserId(user.USER_ID);
        if (!student) {
            throw new NotFoundException(
                'Student not found',
            );
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
            DEFAULTER_Attempts:
                student.DEFAULTER_Attempts,
        };
    }  
}
