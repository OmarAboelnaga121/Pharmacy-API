import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, IsStrongPassword } from "class-validator";

export class RegisterDto {
    @ApiProperty({ description: 'Name of the user' })
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @ApiProperty({ description: 'Phone Number of the user' })
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;
        
    @ApiProperty({ description: 'Address of the user' })
    @IsNotEmpty()
    @IsString()
    address: string;
    
    @ApiProperty({ description: 'Email of the user' })
    @IsNotEmpty()
    @IsEmail()
    email: string;
        
    @ApiProperty({ description: 'Password of the user' })
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
        
    @ApiProperty({ description: 'Role of the user' })
    @IsNotEmpty()
    @IsString()
    role: string;
}