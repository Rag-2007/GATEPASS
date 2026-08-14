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
            Block_Id: body.Block_Id,
            Is_Blocked: false,
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
        const userId = existing.User_Id;
        await this.studentrepo.deleteStudent(RollNo);
        await this.authrepo.deleteUser(userId);
        return {message : 'Student deleted successfully'};
    }

    async updateStudent(body: AddStudentDto){
        const existing = await this.studentrepo.findByRollNo(body.Roll_NO);

        if (!existing) {
            throw new BadRequestException('Roll number does not exist');
        }

        const userId = existing.User_Id;
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
                Block_Id: body.Block_Id,
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
            throw new NotFoundException("No students found");
        }

        const result = await Promise.all(
            students.map(async (student) => {
                const user = await this.authrepo.findUserById(student.User_Id);

                return {
                    USER_ID: student.User_Id,
                    Roll_NO: student.Roll_No,

                    Name: user?.Name,
                    Email: user?.Email,
                    PhoneNo: user?.Phone,

                    Hostel_Id: student.Block_Id,

                    Parent_Name: student.PARENT_NAME,
                    Parent_Mail: student.PARENT_MAIL,
                    Parent_Phone: student.PARENT_PHONE,

                    Address: student.ADDRESS,

                    IS_BLOCKED: student.Is_Blocked,
                    DEFAULTER_Attempts: student.DEFAULTER_Attempts,
                };
            })
        );

        return result;
    }

    async getByHostel(HostelID: string) {
        const students = await this.studentrepo.getByHostel(HostelID);
        if (students.length === 0) {
            throw new NotFoundException(
                "No students found in this hostel"
            );
        }

        const result = await Promise.all(
            students.map(async (student) => {
                const user = await this.authrepo.findUserById(student.User_Id);

                return {
                    USER_ID: student.User_Id,
                    Roll_NO: student.Roll_No,

                    Name: user?.Name,
                    Email: user?.Email,
                    PhoneNo: user?.Phone,

                    Hostel_Id: student.Block_Id,

                    Parent_Name: student.PARENT_NAME,
                    Parent_Mail: student.PARENT_MAIL,
                    Parent_Phone: student.PARENT_PHONE,

                    Address: student.ADDRESS,

                    IS_BLOCKED: student.Is_Blocked,
                    DEFAULTER_Attempts:
                        student.DEFAULTER_Attempts,
                };
            })
        );

        return result;
    }

    async getMe(email: string) {
        const user =await this.authrepo.findUserByEmail(email);
        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }
        const student = await this.studentrepo.findByUserId(user.Id);
        if (!student) {
            throw new NotFoundException(
                'Student not found',
            );
        }
        return {
            USER_ID: user.Id,
            Roll_NO: student.Roll_No,

            Name: user.Name,
            Email: user.Email,
            PhoneNo: user.Phone,

            Hostel_Id: student.Block_Id,

            Parent_Name: student.PARENT_NAME,
            Parent_Mail: student.PARENT_MAIL,
            Parent_Phone: student.PARENT_PHONE,

            Address: student.ADDRESS,

            IS_BLOCKED: student.Is_Blocked,
            DEFAULTER_Attempts:
                student.DEFAULTER_Attempts,
        };
    }  
}
