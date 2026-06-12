import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

@Module({
  exports : [AuthService,AuthRepository],
  controllers: [AuthController],
  providers: [AuthService,AuthRepository]
})
export class AuthModule {}
