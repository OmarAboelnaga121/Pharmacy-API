import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/user/dto';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
    constructor(private prismaService: PrismaService){}

    async getOrdersForUser(user : UserDto){
        // Get all orders for user
        const orders = await this.prismaService.orders.findMany({
            where:{userId: user.id}
        });

        return orders;
    }

    async createOrder(user: UserDto, order ){
        // Check if user exists
        const userExists = await this.prismaService.user.findUnique({
            where: {id: user.id}
        });

        if(!userExists){
            throw new Error("User does not exist");
        }

        // Check if medicine exists
        const medicineExists = await this.prismaService.medicines.findUnique({
            where: {id: order.medicineId}
        });

        if(!medicineExists){
            throw new Error("Medicine does not exist");
        }

        // Create order
        const newOrder = await this.prismaService.orders.create({
            data: {
                userId: user.id,
                ...order,
            }
        });

        return newOrder;
    }
}
