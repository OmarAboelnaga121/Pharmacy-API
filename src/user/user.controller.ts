import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserMe } from 'src/auth/decorator/user.decorator';
import { UserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    // Swagger API documentation
    @ApiOperation({ summary: 'Get User Profile' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'User profile' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getUser(@UserMe() user : UserDto){
        return user;
    }

    @Get('users')
    @UseGuards(AuthGuard('jwt'))
    // Swagger API documentation
    @ApiOperation({ summary: 'Get All Users' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Users' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getUsers(@UserMe() user : UserDto){
        return this.userService.getAllUsers(user);
    }
}
