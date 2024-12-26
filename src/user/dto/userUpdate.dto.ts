import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UserUpdateDto {
    @ApiProperty({ description: 'Name of the user' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Phone number of the user' })
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({ description: 'Address of the user' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ description: 'Email of the user' })
    @IsEmail()
    @IsOptional()
    email?: string;
}
