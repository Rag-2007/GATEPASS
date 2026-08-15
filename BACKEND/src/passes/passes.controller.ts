import { Controller, Get, Post, Body, Put, Param, Req, UseGuards } from '@nestjs/common';
import { PassesService } from './passes.service';
import { CreatePassDto } from './dto/create-pass.dto';
import { PassStatus, UpdatePassDto } from './dto/update-pass.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/dto/login.dto';
import { Roles } from '../auth/guard/roles.decorator';
import { SecuritySignatureGuard } from '../auth/guard/security-signature.guard';

@Controller('Passes')
export class PassesController {
  constructor(private readonly passesService: PassesService) { }

  @Get("getAllPasses")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.WARDEN)
  async getAll(): Promise<any> {
    return await this.passesService.getAllPasses();
  }

  @Get("getByHostel/:id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.WARDEN, UserRole.CARETAKER)
  async getByHostel(@Param('id') id: string) {
    return await this.passesService.getByHostel(id);
  }

  @Get("getByStatus/:status")
  async getByStatus(@Param('status') status: PassStatus) {
    return await this.passesService.getByStatus(status);
  }

  @Get("getMyPasses")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async getMyPasses(@Req() req: any) {
    return await this.passesService.getMyPasses(req.user.email);
  }

  @Get("getByHostelStatus/:id/:status")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.WARDEN, UserRole.CARETAKER)
  async getByHostelStatus(@Param('id') id: string, @Param('status') status: PassStatus) {
    return await this.passesService.getByHostelStatus(id, status);
  }

  @Get("getPassActions")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.WARDEN)
  async getPassActions() {
    return await this.passesService.getPassActions();
  }

  @Post("createPass")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async createPass(@Body() createPass: CreatePassDto, @Req() req: any): Promise<any> {
    return await this.passesService.createPass(createPass, req.user.email);
  }

  @Put("cancelPass/:id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async cancelPass(@Param('id') id: string, @Req() req: any) {
    return await this.passesService.cancelPass(id, req.user.email);
  }

  @Put("approveParent/:id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.PARENT)
  async approveParent(@Param('id') id: string) {
    return await this.passesService.approveParent(id);
  }

  @Put("approveCaretaker/:id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.CARETAKER, UserRole.WARDEN)
  async approveCaretaker(@Param('id') id: string, @Req() req: any) {
    return await this.passesService.approveCaretaker(id, req.user.email);
  }

  @Put("rejectPass/:id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.CARETAKER, UserRole.WARDEN)
  async rejectPass(@Param('id') id: string, @Req() req: any) {
    return await this.passesService.rejectPass(id, req.user.email);
  }

  @Get("Scan/:mode/:id")
  @UseGuards(SecuritySignatureGuard)
  async validateScan(@Param('mode') mode: string, @Param('id') id: string) {
    return await this.passesService.validateScan(mode, id);
  }

  @Put("Checkin/:id")
  @UseGuards(SecuritySignatureGuard)
  async checkin(@Param('id') id: string) {
    return await this.passesService.checkin(id);
  }

  @Put("Checkout/:id")
  @UseGuards(SecuritySignatureGuard)
  async checkout(@Param('id') id: string) {
    return await this.passesService.checkout(id);
  }
}
