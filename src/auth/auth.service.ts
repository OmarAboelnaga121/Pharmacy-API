import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { LoginDto, RegisterDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService : JwtService) {}


    // Method to register a new user
    async registerUser(userDto: RegisterDto) {
        // Check if the user with the given email already exists
        const existingUser = await this.prismaService.user.findUnique({
            where: { email: userDto.email },
        });

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        // Hash the password using argon2
        const hashedPassword = await argon2.hash(userDto.password);

        // Create a new user in the database using PrismaService
        const user = await this.prismaService.user.create({
            data: {
                name: userDto.name,
                phoneNumber: userDto.phoneNumber,
                address: userDto.address,
                email: userDto.email,
                password: hashedPassword,
                role: userDto.role as Role,
            },
            select: { 
                id: true,
                name: true,
                phoneNumber: true,
                address: true,
                email: true,
            },
        });
        // Generate Token
        const token = this.GenrateToken(user);
        // Return User
        return {token, user: user};
    }

    async loginUser(userDto: LoginDto) {
        // Check For User Mail
        const existingUser = await this.prismaService.user.findUnique({where: {email: userDto.email}});

        if(!existingUser) throw new NotFoundException('Credentials not valid');

        // Check for User's Password
        const isPasswordVaild = await argon2.verify(existingUser.password, userDto.password);

        if(!isPasswordVaild) throw new NotFoundException('Credentials not valid');

        // Generate Token
        const token = this.GenrateToken(existingUser);
        // Return User
        return {token, user: existingUser};
    }

    private GenrateToken(user : any) {
        // Generate Token
        const payload = { email: user.email, sub: user.id };
        return{
            access_token: this.jwtService.sign(payload),
        }
    }
}
