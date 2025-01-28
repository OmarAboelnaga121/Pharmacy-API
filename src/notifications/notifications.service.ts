import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/user/dto';

@Injectable()
export class NotificationsService {
    constructor(private prismaService : PrismaService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async getNotificationsByRole(role: Role) {
        const cacheKey = `notifications_${role}`;
        const cachedNotifications = await this.cacheManager.get(cacheKey);
        
        if (cachedNotifications) {
            return cachedNotifications;
        }

        const notifications = await this.prismaService.$transaction(async (prisma) => {
            const notifications = await prisma.notification.findMany({
                where: { 
                    targetRole: { has: role }
                },
                orderBy: [
                    { isRead: 'asc' },
                    { createdAt: 'desc' }
                ]
            });

            if (notifications.length > 0) {
                await prisma.notification.updateMany({
                    where: {
                        id: { in: notifications.map(n => n.id) },
                        isRead: false
                    },
                    data: { isRead: true }
                });
                
                await this.cacheManager.set(cacheKey, notifications, 60 * 60 * 24);
            }

            return notifications;
        });

        return notifications;
    }
}
