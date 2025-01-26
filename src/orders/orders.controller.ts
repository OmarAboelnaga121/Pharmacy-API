import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UserMe } from 'src/auth/decorator/user.decorator';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { OrderStatus } from '@prisma/client';
import { OrderDto, OrderStatusDto } from './dto';

@Controller('orders')
@UseGuards(ThrottlerGuard)
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
    constructor(private ordersService: OrdersService){}

    // Get all orders for user
    @Get('userOrders')
    // Swagger API documentation
    @ApiOperation({ summary: 'Get User Orders' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'User profile' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    getOrdersForUser(@UserMe() user){
        return this.ordersService.getOrdersForUser(user);
    }

    // Create User's Order
    @Post('createOrder')
    // Swagger API documentation
    @ApiOperation({ summary: "Create User's Order"})
    @ApiBearerAuth()
    @ApiBody({ type: OrderDto })
    @ApiResponse({ status: 201, description: 'Order created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    createOrder(@UserMe() user,@Body() order : OrderDto){
        return this.ordersService.createOrder(user, order);
    }

    // Delete User's Order
    @Delete('deleteOrder/')
    // Swagger API documentation
    @ApiOperation({ summary: "Cancel User's Order"})
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Order Deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    deleteOrder(@UserMe() user,@Query('orderId') orderId : string){
        return this.ordersService.cancelOrder(user, orderId);
    }
    
    // Update order status
    @Patch('updateOrder')
    // Swagger API documentation
    @ApiOperation({ summary: "update order status"})
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Order created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBody({ type: OrderStatusDto })
    updateOrderStatus(@Query('order id') orderId : string,@UserMe() user,@Body() status : OrderStatusDto){
        return this.ordersService.updateOrderStatus(orderId, user, status);
    }

    // Get all orders for admins and customer support
    @Get('allOrders')
    // Swagger API documentation
    @ApiOperation({ summary: 'Get all orders for admins and customer support' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'orders' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    getOrdersForAdminsAndCustomerSupport(@UserMe() user){
        return this.ordersService.getAllOrders(user);
    }

    // Get order by id
    @Get('singleOrder')
    // Swagger API documentation
    @ApiOperation({ summary: 'Get order by id' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'order' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    getSingleOrder(@UserMe() user, @Query('order id') orderId : string){
        return this.ordersService.getOrderById(user, orderId);
    }

    // Get all orders for admins and customer support
    @Get('ordersByStatus')
    // Swagger API documentation
    @ApiOperation({ summary: 'get orders by status' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'orders' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    getOrdersByStatus(@UserMe() user, @Query('status') status : OrderStatus){
        return this.ordersService.getOrdersByStatus(user, status);
    }
}
