import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UserMe } from 'src/auth/decorator/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { OrderDto } from './dto/order.dto';

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
    @ApiResponse({ status: 200, description: 'Order created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    createOrder(@UserMe() user,@Body() order : OrderDto){
        return this.ordersService.createOrder(user, order);
    }
}
