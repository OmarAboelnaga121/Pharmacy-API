import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

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
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @Min(0)
    price: number;

    @ApiProperty({ description: 'Stock of the medicine' })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @Min(0)
    stock: number;
}
