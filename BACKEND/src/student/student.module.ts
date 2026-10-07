import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentRepository } from './student.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  exports: [StudentRepository],
  controllers: [StudentController],
  providers: [StudentService,StudentRepository]
})
export class StudentModule {}
