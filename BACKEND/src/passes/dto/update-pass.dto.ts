import { PartialType } from '@nestjs/mapped-types';
import { CreatePassDto } from './create-pass.dto';
import { IsEnum, IsString } from 'class-validator';

export enum PassStatus {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  Parentapproved = "Parentapproved",
  CareTakerapproved = "CareTakerapproved",
  CHECKEDIN = "CHECKEDIN",
  CHECKEDOUT = "CHECKEDOUT"
}

export class UpdatePassDto extends PartialType(CreatePassDto) {
    @IsEnum(PassStatus)
    Status!: PassStatus;
    
}
