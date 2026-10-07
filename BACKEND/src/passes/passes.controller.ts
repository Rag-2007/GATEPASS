import { Controller, Get, Post, Body, Put, Param, Req, Res, Query, UseGuards } from '@nestjs/common';
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
  @Get('parent/respond')
  async parentRespond(@Query('token') token: string, @Query('action') action: string, @Res() res: any) {
    if (!token || (action !== 'approve' && action !== 'reject')) {
      return res.type('html').send(renderResponsePage('error', 'Invalid link. The URL is malformed or missing parameters.'));
    }

    const result = await this.passesService.handleParentTokenResponse(token, action as 'approve' | 'reject');

    if (result.status === 'approved') {
      return res.type('html').send(renderResponsePage('approved', 'You have successfully approved the home pass request. The caretaker will be notified.'));
    }
    if (result.status === 'rejected') {
      return res.type('html').send(renderResponsePage('rejected', 'You have rejected the home pass request. The student has been notified.'));
    }
    if (result.status === 'expired') {
      return res.type('html').send(renderResponsePage('error', 'This pass is no longer in a pending state and cannot be acted upon.'));
    }
    return res.type('html').send(renderResponsePage('error', 'This link has already been used or has expired. Each link is one-time use only.'));
  }
}

function renderResponsePage(type: 'approved' | 'rejected' | 'error', message: string): string {
  const colors: Record<string, { bg: string; icon: string; title: string }> = {
    approved: { bg: '#15803d', icon: '✓', title: 'Pass Approved' },
    rejected: { bg: '#b91c1c', icon: '✗', title: 'Pass Rejected' },
    error:    { bg: '#1d4ed8', icon: '!', title: 'Link Invalid' },
  };
  const c = colors[type];
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${c.title} — IIIT Sri City Gatepass</title></head><body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;"><div style="background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.10);padding:48px 40px;max-width:420px;width:90%;text-align:center;"><div style="width:72px;height:72px;border-radius:50%;background:${c.bg};display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:36px;color:#fff;font-weight:900;">${c.icon}</div><h1 style="margin:0 0 12px;color:#0D1B2A;font-size:24px;font-weight:800;">${c.title}</h1><p style="margin:0 0 28px;color:#4b5563;font-size:15px;line-height:1.6;">${message}</p><p style="margin:0;color:#9ca3af;font-size:12px;">IIIT Sri City Hostel Gatepass System</p></div></body></html>`;
}
