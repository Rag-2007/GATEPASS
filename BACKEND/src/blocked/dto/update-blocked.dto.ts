import { PartialType } from '@nestjs/mapped-types';
import { CreateBlockedDto } from './create-blocked.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBlockedDto extends PartialType(CreateBlockedDto) {

    @IsNotEmpty()
    @IsString()
    Blocked_Role_id!: string;
}

