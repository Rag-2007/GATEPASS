import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum UserRole {
  STUDENT = 'STUDENT',
  CARETAKER = 'CARETAKER',
  WARDEN = 'WARDEN',
  PARENT = 'PARENT' ,
  SECURITY = 'SECURITY'
}

export class LoginDto {
  @IsEmail()
  Email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(Role)
  role!:  Role;
}
