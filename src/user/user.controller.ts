import { Body, Controller, Get, Patch, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserMe } from 'src/auth/decorator/user.decorator';
import { UserDto } from './dto';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Role } from '@prisma/client';

@Controller('user')
@UseGuards(ThrottlerGuard)
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(private userService: UserService) {}

    @Get('profile')
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
    // Swagger API documentation
    @ApiOperation({ summary: 'Get All Users' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Users' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getUsers(@UserMe() user : UserDto){
        return this.userService.getAllUsers(user);
    }

    @Get('roles')
    // Swagger API documentation
    @ApiOperation({ summary: 'Get All Users' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Users' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getUsersByRoles(@UserMe() user : UserDto, @Query('role') role : Role){
        return this.userService.getUsersByRole(user, role);
    }

    @Patch('edit')
    // Swagger API documentation
    @ApiOperation({ summary: 'Edit User'})
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'User edited' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBody({ type: UserUpdateDto })
    async editUser(@UserMe() user : UserDto, @Body() newData : UserUpdateDto){
        return this.userService.editUser(user.id, newData);
    }

    @Patch('userEditAdmin/:userId')
    // Swagger API documentation
    @ApiOperation({ summary: 'Edit User For Admin'})
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'User edited' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBody({ type: UserUpdateDto })
    async editUserForAdmin(@UserMe() user : UserDto,@Query('id') userId : string , @Body() newData : UserUpdateDto){
        return this.userService.editUsersAdmin(user ,userId , newData);
    }

    @Delete('delete')
    // Swagger API documentation
    @ApiOperation({ summary: 'Delete User'})
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'User deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async deleteUser(@UserMe() user : UserDto, @Query('id') userId : string){
        return this.userService.deleteUser(user, userId);
    }
}
