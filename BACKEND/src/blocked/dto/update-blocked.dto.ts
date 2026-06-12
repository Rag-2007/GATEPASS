import { PartialType } from '@nestjs/mapped-types';
import { CreateBlockedDto } from './create-blocked.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBlockedDto extends PartialType(CreateBlockedDto) {

    @IsNotEmpty()
    @IsString()
    Blocked_Role_id!: string;
}
// Roll_NO(FK)
// Hostel_id (FK)
// Blocked_Role_id(FK)
// Blocked_At
// Unblocked_At

// {
//     "Roll_NO":"S20240010032",
//     "Hostel_id":"BH-1",
//     "Blocked_Role_id":"WARDEN-01"
// }