import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MedicineModule } from './medicine/medicine.module';
import { PrismaModule } from './prisma/prisma.module';
import * as redisStore from 'cache-manager-redis-store'; 
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), CacheModule.register({
    isGlobal: true,
    store: redisStore as any,
    host:'localhost',
    port: 6379,
    ttl: 60,
  }), AuthModule, UserModule, MedicineModule, PrismaModule,
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10,
    }])],
  controllers: [],
  providers: [{
    provide:APP_INTERCEPTOR,
    useClass:CacheInterceptor
  }],
})
export class AppModule {}
