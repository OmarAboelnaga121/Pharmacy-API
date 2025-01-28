import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/user/dto';
import { OrderDto } from './dto/order.dto';
import { OrderStatus, Role } from '@prisma/client';
import { OrderStatusDto } from './dto';

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
            throw new BadRequestException("User does not exist");
        }

        // Check if medicine exists
        const medicineExists = await this.prismaService.medicines.findUnique({
            where: {id: order.medicineId}
        });

        if(!medicineExists){
            throw new BadRequestException("Medicine does not exist");
        }

        // Create order
        const newOrder = await this.prismaService.orders.create({
            data: {
                userId: user.id,
                ...order,
            }
        });

        const notification = await this.prismaService.notification.create({
            data: {
                userId: user.id,
                resourceId: newOrder.id,
                from: user.name,
                message: "New Order",
                type: "ORDER",
                targetRole: [Role.ADMIN, Role.CUSTOMER, Role.CUSTOMER_SUPPORT],
            }
        })

        return newOrder;
    }

    async cancelOrder(user : UserDto, orderId: string) {
        // Validate order exists
        const order = await this.prismaService.orders.findUnique({
            where: { id: parseInt(orderId) }
        });
    
        if (!order) {
            throw new BadRequestException('Order not found');
        }
    
        // Check if order can be cancelled
        if (order.status === 'DELIVERED') {
            throw new BadRequestException('Cannot cancel delivered order');
        }

        if(order.userId !== user.id){
            return new BadRequestException('You are not authorized to perform this action');
        }
    
        // Update order status to cancelled
        return await this.prismaService.orders.update({
            where: { id: parseInt(orderId) },
            data: { 
                status: 'CANCELLED',
                updatedAt: new Date()
            }
        });

        const notification = await this.prismaService.notification.create({
            data: {
                userId: user.id,
                resourceId: order.id,
                from: user.name,
                message: "Order Has Canceled",
                type: "ORDER",
                targetRole: [Role.ADMIN, Role.CUSTOMER, Role.CUSTOMER_SUPPORT],
            }
        })

    }

    // Update order by stauts
    async updateOrderStatus(orderId : string, user : UserDto, status : OrderStatusDto){
        // check if the user is a customer support or admin
        const userExists = await this.prismaService.user.findUnique({
            where: {id: user.id}
        });

        if(!userExists){
            throw new BadRequestException("User does not exist");
        }

        if(user.role !== Role.ADMIN && user.role !== Role.PHARMACIST){
            throw new UnauthorizedException('You are not authorized to perform this action');
        }

        // check if the order exists
        const orderExists = await this.prismaService.orders.findUnique({
            where: {id: parseInt(orderId)}
        });

        if(!orderExists){
            throw new BadRequestException("Order does not exist");
        }

        if(orderExists.status === status.status){
            throw new BadRequestException("Order is already in this status");
        }

        if(status.status === OrderStatus.OUTFORDELIVERY){
            // Get medicine details
            const medicine = await this.prismaService.medicines.findUnique({
                where: { id: orderExists.medicineId }
            });

            if (!medicine) {
                throw new NotFoundException('Medicine not found');
            }

            // Update medicine stock
            await this.prismaService.medicines.update({
                where: { id: orderExists.medicineId },
                data: {
                    stock: medicine.stock - orderExists.quantity
                }
            });

            const notification = await this.prismaService.notification.create({
                data: {
                    userId: user.id,
                    resourceId: parseInt(orderId),
                    from: user.name,
                    message: "Order is Out For Delivery",
                    type: "ORDER",
                    targetRole: [Role.ADMIN, Role.CUSTOMER, Role.CUSTOMER_SUPPORT],
                }
            })
        }

        // Update order status
        const updatedOrder = await this.prismaService.orders.update({
            where: {id: parseInt(orderId)},
            data: {status: status.status}
        });

        return updatedOrder;
    }

    // Get all orders
    async getAllOrders(user : UserDto){
        // check if the user is a customer support or admin
        const userExists = await this.prismaService.user.findUnique({
            where: {id: user.id}
        });

        if(!userExists){
            throw new BadRequestException("User does not exist");
        }

        if(user.role !== Role.ADMIN && user.role !== Role.PHARMACIST){
            throw new UnauthorizedException('You are not authorized to perform this action');
        }

        // Get all orders
        const orders = await this.prismaService.orders.findMany();

        return orders;

    }

    // Get single order by ID
    async getOrderById(user: UserDto, orderId: string){
        // Check if the user exists
        const userExists = await this.prismaService.user.findUnique({
            where: {id: user.id}
        });

        if(!userExists){
            throw new BadRequestException("User does not exist");
        }

        // Check if the order exists
        const orderExists = await this.prismaService.orders.findUnique({
            where: {id: parseInt(orderId)}
        });

        if(!orderExists){
            throw new BadRequestException("Order does not exist");
        }

        return orderExists;
    }

    // Get orders by status
    async getOrdersByStatus(user: UserDto, status: OrderStatus){
        // check if the user is a customer support or admin
        const userExists = await this.prismaService.user.findUnique({
            where: {id: user.id}
        });

        if(!userExists){
            throw new BadRequestException("User does not exist");
        }

        if(user.role !== Role.ADMIN && user.role !== Role.PHARMACIST){
            throw new UnauthorizedException('You are not authorized to perform this action');
        }

        // Get orders by status
        const orders = await this.prismaService.orders.findMany({
            where: {status: status}
        });

        return orders;
    }
}