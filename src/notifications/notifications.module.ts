import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports:[PrismaModule,
    CacheModule.register({
      ttl: 60 * 60 * 24, // 24 hours
    })
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
