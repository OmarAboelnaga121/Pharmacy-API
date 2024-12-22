import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({ description: 'Email of the user' })
    @IsNotEmpty()
    @IsEmail()
    email: string;
        
    @ApiProperty({ description: 'Password of the user' })
    @IsNotEmpty()
    password: string;
}