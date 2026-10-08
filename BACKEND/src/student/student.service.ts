import { Injectable , BadRequestException , NotFoundException } from '@nestjs/common';
import { AddStudentDto } from './dto/addstudent.dto';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../auth/dto/login.dto';
import { StudentRepository } from './student.repository';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class StudentService {
    constructor(public authservice : AuthService , public studentrepo : StudentRepository , public authrepo : AuthRepository){}

    private convertDriveLink(driveUrl: string): string {
        const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            const fileId = match[1];
            return `https://drive.google.com/uc?id=${fileId}`;
        }
        return driveUrl;
    }

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
        const encodedName = encodeURIComponent(body.Name);
        let photoUrl = `https://ui-avatars.com/api/?background=0D1B2A&color=FFE38A&size=256&bold=true&name=${encodedName}`;
        
        if (body.Photo_Url) {
            photoUrl = this.convertDriveLink(body.Photo_Url);
        }
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
            Photo_Url: photoUrl,
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

        const updateData: any = {
            Block_Id: body.Block_Id,
            PARENT_MAIL: body.Parent_Mail,
            PARENT_NAME: body.Parent_Name,
            ADDRESS: body.Address,
            PARENT_PHONE: body.Parent_Phone,
        };

        if (body.Photo_Url) {
            updateData.Photo_Url = this.convertDriveLink(body.Photo_Url);
        }

        await this.studentrepo.updateStudent(
            body.Roll_NO,
            updateData,
        );

        return {message: 'Student updated successfully',};
    }

    async getAll() {
        const students = await this.studentrepo.getAllStudentsWithUser();

        if (students.length === 0) {
            throw new NotFoundException("No students found");
        }

        return students.map((student) => ({
            USER_ID: student.User_Id,
            Roll_NO: student.Roll_No,

            Name: student.user?.Name,
            Email: student.user?.Email,
            PhoneNo: student.user?.Phone,

            Hostel_Id: student.Block_Id,
            Photo_Url: student.Photo_Url,

            Parent_Name: student.PARENT_NAME,
            Parent_Mail: student.PARENT_MAIL,
            Parent_Phone: student.PARENT_PHONE,

            Address: student.ADDRESS,

            IS_BLOCKED: student.Is_Blocked,
            DEFAULTER_Attempts: student.DEFAULTER_Attempts,
        }));
    }

    async getByHostel(HostelID: string) {
        const students = await this.studentrepo.getByHostelWithUser(HostelID);
        if (students.length === 0) {
            throw new NotFoundException(
                "No students found in this hostel"
            );
        }

        return students.map((student) => ({
            USER_ID: student.User_Id,
            Roll_NO: student.Roll_No,

            Name: student.user?.Name,
            Email: student.user?.Email,
            PhoneNo: student.user?.Phone,

            Hostel_Id: student.Block_Id,
            Photo_Url: student.Photo_Url,

            Parent_Name: student.PARENT_NAME,
            Parent_Mail: student.PARENT_MAIL,
            Parent_Phone: student.PARENT_PHONE,

            Address: student.ADDRESS,

            IS_BLOCKED: student.Is_Blocked,
            DEFAULTER_Attempts: student.DEFAULTER_Attempts,
        }));
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

