import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class MedicineDto {

    @ApiProperty({ description: 'Name of the medicine' })
    @IsString()
    @IsNotEmpty()
    medicinieName: string;

    @ApiProperty({ description: 'Description of the medicine' })
    @IsString()
    @IsNotEmpty()
    Description: string;

    @ApiProperty({ description: 'Price of the medicine' })
    price: number;

    @ApiProperty({ description: 'Stock of the medicine' })
    stock: number;
}
