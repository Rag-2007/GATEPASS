import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { CreateBlockedDto } from './dto/create-blocked.dto';
import { UpdateBlockedDto } from './dto/update-blocked.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/dto/login.dto';
import { Roles } from '../auth/guard/roles.decorator';


@UseGuards(JwtGuard,RolesGuard)
@Controller('Blocked')

export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Put("unblockStudent/:rollNo")
  @Roles(UserRole.WARDEN)
  unblockStudent(@Param('rollNo') rollNo: string, @Body() updateBlockedDto: UpdateBlockedDto) {
    return this.blockedService.unblockStudent(rollNo,updateBlockedDto);
  }

  @Post("blockStudent")
  @Roles(UserRole.WARDEN,UserRole.SECURITY,UserRole.CARETAKER)
  blockStudent(@Body() createBlockedDto: CreateBlockedDto) {
    return this.blockedService.createBlocked(createBlockedDto);
  }

  @Get("getAllBlocked")
  @Roles(UserRole.WARDEN)
  getAllBlocked() {
    return this.blockedService.getAllBlocked();
  }

}
