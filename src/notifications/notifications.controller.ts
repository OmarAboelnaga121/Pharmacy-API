import { Controller, Get, UnauthorizedException, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserMe } from 'src/auth/decorator/user.decorator';
import { UserDto } from 'src/user/dto';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
@UseGuards(ThrottlerGuard)
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) {}

    @Get()
   // Swagger API documentation
       @ApiOperation({ summary: 'Get User Orders' })
       @ApiBearerAuth()
       @ApiResponse({ status: 200, description: 'User profile' })
       @ApiResponse({ status: 401, description: 'Unauthorized' })
       @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getNotificationsByRole(@UserMe() user: UserDto) {

        return this.notificationsService.getNotificationsByRole(user.role);
    }
}
