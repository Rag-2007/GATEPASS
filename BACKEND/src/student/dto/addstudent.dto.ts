import {IsString,IsEmail,IsNotEmpty,MinLength} from 'class-validator';

export class AddStudentDto {

  @IsString()
  @IsNotEmpty()
  Name!: string;

  @IsEmail()
  Email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  PhoneNo!: string;

  @IsString()
  @IsNotEmpty()
  Roll_NO!: string;

  @IsString()
  @IsNotEmpty()
  Hostel_Id!: string;

  @IsEmail()
  Parent_Mail!: string;

  @IsString()
  @IsNotEmpty()
  Parent_Name!: string;

  @IsString()
  @IsNotEmpty()
  Address!: string;

  @IsString()
  @IsNotEmpty()
  Parent_Phone!: string;
}