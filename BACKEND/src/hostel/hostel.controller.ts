import { Controller, Delete, Post , Put , Get , Body , Param , Req} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guard/role.guard';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { UserRole } from '../auth/dto/login.dto';
import { HostelService } from './hostel.service';
import { AddHostelBlockDto } from './dto/addhostel.dto';

@UseGuards(JwtGuard,RolesGuard)
@Controller('hostel')
export class HostelController {

    constructor(public hostelservice : HostelService){}

    @Post('/addHostel')
    @Roles(UserRole.WARDEN)
    async addHostel(@Body() Hostel:AddHostelBlockDto){
        return this.hostelservice.addHostel(Hostel) ;
    }

    @Delete('/deleteHostel/:hostelId')
    @Roles(UserRole.WARDEN)
    async deleteHostel(@Param('hostelId') HostelID:string){
        return this.hostelservice.deleteHostel(HostelID) ;
    }


    @Put('/updateHostel')
    @Roles(UserRole.WARDEN)
    async updateHostel(@Body() Hostel:AddHostelBlockDto){
        return this.hostelservice.updateHostel(Hostel) ;
    }

    @Get('/getAllHostels')
    @Roles(UserRole.WARDEN,UserRole.CARETAKER)
    async getAllHostels(){
        return this.hostelservice.getAllHostels() ;
    }


    @Get('/getMe')
    @Roles(UserRole.WARDEN,UserRole.CARETAKER)
    async getMe(@Req() req:any){
        const email = req.user.email ;
        const role = req.user.role ;
        return this.hostelservice.getMe(email,role) ;
    }

}
