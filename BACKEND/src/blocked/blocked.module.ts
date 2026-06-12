import { Module } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { BlockedController } from './blocked.controller';
import {BlockedRepository} from "./blocked.repository";
import { StudentRepository } from '../student/student.repository';
@Module({
  controllers: [BlockedController],
  providers: [BlockedService, BlockedRepository,StudentRepository],
  exports:[BlockedRepository]
})
export class BlockedModule {}
