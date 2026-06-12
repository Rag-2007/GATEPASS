import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum UserRole {
  STUDENT = 'Student',
  CARETAKER = 'CareTaker',
  WARDEN = 'Warden',
  PARENT = 'Parent' ,
  SECURITY = 'Security'
}

export class LoginDto {
  @IsEmail()
  Email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}