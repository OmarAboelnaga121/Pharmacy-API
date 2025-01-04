import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto, UserUpdateDto } from './dto';
import { Role } from '@prisma/client';
@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {} // PrismaService

    // Get All Users
    async getAllUsers(user : UserDto){
        // Check user's role
        if(user.role !== Role.ADMIN && user.role !== Role.CUSTOMER_SUPPORT){
            throw new BadRequestException('You are not authorized to access this resource');
        }

        // Get all users
        const users = this.prismaService.user.findMany();

        // Return all users
        return users;
    }
    // Get user by roles
    async getUsersByRole(user : UserDto, role: Role){
        // Check user's role
        if(user.role !== Role.ADMIN && user.role !== Role.CUSTOMER_SUPPORT){
            throw new BadRequestException('You are not authorized to access this resource');
        }

        // Get all users
        const users = this.prismaService.user.findMany({
            where:{role: role}
        });

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

    

    // Edit user for admin
    async editUsersAdmin(user : UserDto, userId : string, data : UserUpdateDto){
        if(user.role !== Role.ADMIN){
            throw new BadRequestException('You are not authorized to access this resource');
        }
        
        const checkUser = this.prismaService.user.findUnique({
            where:{id: parseInt(userId)}
        })

        if(!checkUser){
            throw new BadRequestException('User not found');
        }

        if (!Object.values(Role).includes(data.role)) {
            throw new BadRequestException('Invalid role');
        }

        // Update user
        const updatedUser = this.prismaService.user.update({
            where:{id: parseInt(userId)},
            data: data
        });

        return updatedUser;
    }

    // Delete user
    async deleteUser(user : UserDto, userId: string){
        if(user.role !== Role.ADMIN){
            throw new BadRequestException('You are not authorized to access this resource');
        }

        const checkUserToDelete = this.prismaService.user.findUnique({
            where:{id: parseInt(userId)}
        })

        if(!checkUserToDelete){
            throw new BadRequestException('User not found');
        }

        // Delete user
        const deletedUser = this.prismaService.user.delete({
            where:{id: parseInt(userId)}
        });

        return deletedUser;
    }
}
