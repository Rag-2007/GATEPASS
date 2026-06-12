import { Controller, Get, Post, Body, Put, Param, Req } from '@nestjs/common';
import { PassesService } from './passes.service';
import { CreatePassDto } from './dto/create-pass.dto';
import { PassStatus, UpdatePassDto } from './dto/update-pass.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/dto/login.dto';
import { Roles } from '../auth/guard/roles.decorator';

@UseGuards(JwtGuard,RolesGuard)
@Controller('Passes')
export class PassesController {
  constructor(private readonly passesService: PassesService) {}

  @Get("getAllPasses")
  @Roles(UserRole.WARDEN)
  async getAll() :Promise<any>{
    return await this.passesService.getAllPasses();
  }
  @Get("getByHostel/:id")
  @Roles(UserRole.WARDEN,UserRole.CARETAKER)
  async getByHostel(@Param('id') id: string) {
    return await this.passesService.getByHostel(id);
  }

  @Get("getByStatus/:status")
  @Roles(UserRole.WARDEN,UserRole.CARETAKER)
  async getByStatus(@Param('status') status: PassStatus) {
    return await this.passesService.getByStatus(status);
  }

  @Get("getMyPasses")
  @Roles(UserRole.STUDENT)
  async getMyPasses(@Req() req: any) {
    return await this.passesService.getMyPasses(req.user.email);
  }

  @Get("getByHostelStatus/:id/:status")
  @Roles(UserRole.WARDEN,UserRole.CARETAKER)
  async getByHostelStatus(@Param('id') id: string, @Param('status') status: PassStatus) {
    return await this.passesService.getByHostelStatus(id, status);
  }

  @Get("getPassActions")
  @Roles(UserRole.WARDEN)
  async getPassActions() {
    return await this.passesService.getPassActions();
  }

  @Post("createPass")
  @Roles(UserRole.STUDENT)
  async createPass(@Body() createPass: CreatePassDto,@Req() req: any) :Promise<any> {
    return await this.passesService.createPass(createPass,req.user.email);
  }

  @Put("cancelPass/:id")
  @Roles(UserRole.STUDENT)
  async cancelPass(@Param('id') id: string , @Req() req:any) {
    return await this.passesService.cancelPass(id,req.user.email);
  }
  
  @Put("approveParent/:id")
  @Roles(UserRole.PARENT)
  async approveParent(@Param('id') id: string) {
    return await this.passesService.approveParent(id);
  }

  @Put("approveCaretaker/:id")
  @Roles(UserRole.CARETAKER,UserRole.WARDEN)
  async approveCaretaker(@Param('id') id: string, @Req() req:any) {
    return await this.passesService.approveCaretaker(id,req.user.email);
  }

  @Put("Checkin/:id")
  @Roles(UserRole.SECURITY)
  async checkin(@Param('id') id: string, @Req() req:any) {
    return await this.passesService.checkin(id,req.user.email);
  }

  @Put("Checkout/:id")
  @Roles(UserRole.SECURITY)
  async checkout(@Param('id') id: string, @Req() req:any) {
    return await this.passesService.checkout(id,req.user.email);
  }

}