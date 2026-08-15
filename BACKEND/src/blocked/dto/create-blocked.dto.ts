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
