import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class OrderStatusDto {
    @ApiProperty({ 
        enum: OrderStatus,
        description: 'New status for the order',
        example: 'PENDING',
        enumName: 'OrderStatus'
    })
    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status: OrderStatus;
}