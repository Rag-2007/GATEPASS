import { Module } from '@nestjs/common';
import { PassesService } from './passes.service';
import { PassesController } from './passes.controller';
import { PassesRepository } from './passes.repository';
import { BlockedModule } from '../blocked/blocked.module';
import { PassActionsRepository } from './passactions.repository';
import { AuthRepository } from '../auth/auth.repository';
import { StudentRepository } from '../student/student.repository';

@Module({
  imports: [BlockedModule],
  controllers: [PassesController],
  providers: [PassesService, PassesRepository, PassActionsRepository ,AuthRepository ,StudentRepository],
})
export class PassesModule {}
