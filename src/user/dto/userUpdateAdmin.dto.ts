import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UserUpdateAdminDto {
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

    @ApiProperty({ description: 'Role of the user' })
    @IsString()
    @IsOptional()
    role?: Role;
}
