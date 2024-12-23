import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ description: 'ID of the user' })
    id: number;

    @ApiProperty({ description: 'Name of the user' })
    name: string;

    @ApiProperty({ description: 'Phone number of the user' })
    phoneNumber: string;

    @ApiProperty({ description: 'Address of the user' })
    address: string;

    @ApiProperty({ description: 'Email of the user' })
    email: string;

    @ApiProperty({ description: 'Password of the user' })
    password: string;

    @ApiProperty({ description: 'Role of the user' })
    role: string;

    @ApiProperty({ description: 'Creation date of the user' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update date of the user' })
    updatedAt: Date;
}