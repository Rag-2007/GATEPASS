import { Module } from '@nestjs/common';
import { HostelController } from './hostel.controller';
import { HostelService } from './hostel.service';
import { HostelRepository } from './hostel.repository';
import { AuthRepository } from '../auth/auth.repository';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [HostelController],
  providers: [HostelService,HostelRepository,AuthRepository,AuthService]
})
export class HostelModule {}
