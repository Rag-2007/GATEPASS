import { IsNotEmpty, IsString } from "class-validator";

export class CreateBlockedDto {
    @IsNotEmpty()
    @IsString()
    Roll_No!: string;

    @IsNotEmpty()
    @IsString()
    Hostel_id!: string;

    @IsNotEmpty()
    @IsString()
    Blocked_Role_ID!: string;

}
// Roll_NO(FK)
// Hostel_id (FK)
// Blocked_Role_id(FK)
// Blocked_At
// Unblocked_At

// {
//     "Roll_NO":"S20240010032",
//     "Hostel_id":"BH-1"
// }