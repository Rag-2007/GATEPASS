import { Module } from '@nestjs/common';
import { PassesService } from './passes.service';
import { PassesController } from './passes.controller';
import { PassesRepository } from './passes.repository';
import { BlockedModule } from '../blocked/blocked.module';
import { PassActionsRepository } from './passactions.repository';
import { AuthRepository } from '../auth/auth.repository';
import { StudentRepository } from '../student/student.repository';
import { BlockedService } from 'src/blocked/blocked.service';
import { HostelRepository } from 'src/hostel/hostel.repository';
import { Defaulter } from 'src/common/defaulter';
@Module({
  imports: [BlockedModule],
  controllers: [PassesController],
  providers: [PassesService, PassesRepository, PassActionsRepository, AuthRepository, StudentRepository, BlockedService, HostelRepository, Defaulter],
})
export class PassesModule { }
