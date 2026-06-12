import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { AuthService } from '../auth/auth.service';
import { StudentRepository } from './student.repository';
import { AuthRepository } from '../auth/auth.repository';

@Module({
  exports: [StudentRepository],
  controllers: [StudentController],
  providers: [StudentService,AuthService,StudentRepository,AuthRepository]
})
export class StudentModule {}
