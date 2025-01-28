import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto, UserUpdateAdminDto, UserUpdateDto } from './dto';
import { Role, User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    // Get All Users
    async getAllUsers(user : UserDto){
        const cacheKey = `all_users`;
        const cachedUsers = await this.cacheManager.get<User[]>(cacheKey);
        // check the cache
        if (cachedUsers) {
            return cachedUsers;
        }
        
        // Check user's role
        if(user.role !== Role.ADMIN && user.role !== Role.CUSTOMER_SUPPORT){
            throw new BadRequestException('You are not authorized to access this resource');
        }

        // Get all users
        const users = this.prismaService.user.findMany();

        // Check Users
        if ((await users).length === 0) {
            throw new NotFoundException('No users found');
        }

        // Set Cache
        await this.cacheManager.set(cacheKey, users, 60 * 60);

        // Return all users
        return users;
    }
    // Get user by roles
    async getUsersByRole(user : UserDto, role: Role){
        const cacheKey = `user_profile_${user.id}`;
        const cachedProfile = await this.cacheManager.get(cacheKey);
        
        if (cachedProfile) {
            return cachedProfile;
        }
        
        // Check user's role
        if(user.role !== Role.ADMIN && user.role !== Role.CUSTOMER_SUPPORT){
            throw new BadRequestException('You are not authorized to access this resource');
        }

        if (!Object.values(Role).includes(role)) {
            throw new BadRequestException('Invalid role');
        }

        // Get all users
        const users = this.prismaService.user.findMany({
            where:{role: role}
        });

        await this.cacheManager.set(cacheKey, users, 60 * 60);

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
    async editUsersAdmin(user : UserDto, userId : string, data : UserUpdateAdminDto){
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

        const notification = await this.prismaService.notification.create({
            data: {
                userId: user.id,
                resourceId: parseInt(userId),
                from: user.name,
                message: "Order is Out For Delivery",
                type: "ORDER",
                targetRole: [Role.ADMIN, Role.PHARMACIST, Role.CUSTOMER_SUPPORT],
            }
        })

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
