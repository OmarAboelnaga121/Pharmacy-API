import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class updateMedicineDto {

    @ApiProperty({ description: 'Name of the medicine' })
    @IsString()
    @IsOptional()
    medicinieName?: string;

    @ApiProperty({ description: 'Description of the medicine' })
    @IsString()
    @IsOptional()
    Description?: string;

    @ApiProperty({ description: 'Price of the medicine' })
    @IsOptional()
    price?: number;

    @ApiProperty({ description: 'Stock of the medicine' })
    @IsOptional()
    stock?: number;
}
