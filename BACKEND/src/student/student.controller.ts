import { Controller , Post , Delete , Get , Put , Param , Body , Req} from '@nestjs/common';
import { AddStudentDto } from './dto/addstudent.dto';
import { StudentService } from './student.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guard/role.guard';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { UserRole } from '../auth/dto/login.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('student')
export class StudentController {

    constructor(public studentservice : StudentService){}

    @Post('/addStudent')
    @Roles(UserRole.CARETAKER,UserRole.WARDEN)
    async addStudent(@Body() body:AddStudentDto){
        return this.studentservice.addStudent(body) ;
    }


    @Delete('/deleteStudent/:rollno')
    @Roles(UserRole.CARETAKER,UserRole.WARDEN)
    async deleteStudent(@Param('rollno') RollNo:string){
        return this.studentservice.deleteStudent(RollNo) ;
    }

    @Put('/updateStudent')
    @Roles(UserRole.CARETAKER,UserRole.WARDEN,UserRole.STUDENT)
    async updateStudent(@Body() body:AddStudentDto){
        return this.studentservice.updateStudent(body) ;
    }

    @Get('/getAll')
    @Roles(UserRole.CARETAKER,UserRole.WARDEN)
    async getAll(){
        return this.studentservice.getAll() ;
    }


    @Get('/getbyHostel/:hostelid')
    @Roles(UserRole.CARETAKER,UserRole.WARDEN)
    async getbyHostel(@Param('hostelid') HostelID:string){
        return this.studentservice.getByHostel(HostelID) ;
    }

    @Get('/getMe')
    @Roles(UserRole.STUDENT)
    async getMe(@Req() req:any){
        const email = req.user.email ;
        return this.studentservice.getMe(email);
    }

}
