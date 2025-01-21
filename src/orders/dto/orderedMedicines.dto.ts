import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class OrderedMedicineDto {
    @ApiProperty({ description: 'Medicine ID' })
    @IsNotEmpty()
    @IsString()
    medicineId: string;

    @ApiProperty({ description: 'Quantity of medicine ordered' })
    @IsNotEmpty()
    @IsInt()
    quantity: number;
}