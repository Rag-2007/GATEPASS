import {IsEmail,IsEnum,IsString,MinLength} from 'class-validator'
import { UserRole } from './login.dto';

export class SignupDto {

  @IsString()
  Name!: string;

  @IsEmail()
  Email!: string;

  @IsString()
  PhoneNo!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}