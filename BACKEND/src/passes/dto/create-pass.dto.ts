import { IsNotEmpty, IsString , IsEnum , IsDateString,  Matches } from 'class-validator';
enum Pass_Type {
    DAY_PASS = "DAY_PASS",
    HOME_PASS = "HOME_PASS"
}
export class CreatePassDto {


    @IsNotEmpty()
    @IsEnum(Pass_Type)
    passtype!: Pass_Type ;
    

    @IsNotEmpty()
    @IsString()
    destination!: string; 

    @IsNotEmpty()
    @IsString()
    purpose!: string ;

    @IsNotEmpty()
    @IsString()
    modeOfTransport!: string  ;


    @IsNotEmpty()
    @IsDateString()
    expectedDate!: string ;

    @Matches(
   /^([01]\d|2[0-3]):([0-5]\d)$/
 )
    expectedTime!: string ;


}
// {
//    "passtype": "HOME_PASS",
//    "destination": "Hyderabad",
//    "purpose": "Festival Vacation",
//    "modeOfTransport": "Bus",
//    "Status": "CHECKEDIN",
//    "expectedDate": "2026-06-15",
//    "expectedTime": "18:30"
// }