import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsDate, IsString, IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { MedicineDto } from 'src/medicine/dto';
import { UserDto } from 'src/user/dto';
import { OrderedMedicineDto } from './orderedMedicines.dto';

export class OrderDto {
    @ApiProperty({ description: 'Id of the order' })
    @IsNumber()
    @IsNotEmpty()
    medicineId : number

    @ApiProperty({ description: 'Ordered Medicines quantity' })
    @IsNumber()
    @IsNotEmpty()
    quantity : number
}