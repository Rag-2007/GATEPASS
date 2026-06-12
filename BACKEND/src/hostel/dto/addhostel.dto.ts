import {IsString,IsEmail,MinLength} from 'class-validator';
export class AddHostelBlockDto {

  @IsString()
  Block_Id!: string;

  @IsString()
  CareTaker_Name!: string;

  @IsEmail()
  CareTaker_Email!: string;

  @IsString()
  CareTaker_PhoneNo!: string;

  @MinLength(6)
  CareTaker_Password!: string;

  @IsString()
  Warden_Name!: string;

  @IsEmail()
  Warden_Email!: string;

  @IsString()
  Warden_PhoneNo!: string;

  @MinLength(6)
  Warden_Password!: string;
}