import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto';
import { ClassTransformer } from 'class-transformer';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}
    
    @Post('register')
    @ApiOperation({summary: 'Register User'})
    @ApiResponse({status: 201, description: 'User registered successfully'})
    @ApiResponse({status: 500, description: 'Internal Server Error'})
    @ApiBody({ type: RegisterDto })
    registerUser(@Body() userDto: RegisterDto) {
        return this.authService.registerUser(userDto);
    }

    @Post('login')
    @ApiOperation({summary: 'Login User'})
    @ApiResponse({status: 200, description: 'User logged in successfully'})
    @ApiResponse({status: 404, description: 'User not found'})
    @ApiResponse({status: 401, description: 'Invalid credentials'})
    @ApiResponse({status: 500, description: 'Internal Server Error'})
    @ApiBody({ type: LoginDto })
    loginUser(@Body() userDto: LoginDto) {
        return this.authService.loginUser(userDto);
    }
}
