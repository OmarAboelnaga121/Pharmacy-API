import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto, UserUpdateDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {} // PrismaService

    async getAllUsers(user : UserDto){
        // Check user's role
        if(user.role !== 'ADMIN' && user.role !== 'CUSTOMERSUPORT'){
            throw new BadRequestException('You are not authorized to access this resource');
        }

        // Get all users
        const users = this.prismaService.user.findMany();

        // Return all users
        return users;
    }

    // Edit user
    async editUser(userId: number, data: UserUpdateDto){
        const user = this.prismaService.user.findUnique({
            where:{id: userId}
        })

        if(!user){
            throw new BadRequestException('User not found');
        }

        // Update user
        const updatedUser = this.prismaService.user.update({
            where:{id: userId},
            data: data
        });

        return updatedUser;
    }
}
