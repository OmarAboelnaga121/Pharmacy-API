import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MedicineModule } from './medicine/medicine.module';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }), 
    AuthModule, 
    UserModule, 
    MedicineModule, 
    PrismaModule,
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10,
    }]),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket:{
            host: 'localhost',
            port: 6379
          },
          ttl: 60,
        })
      }),
    })],
  controllers: [],
  providers: [{
    provide:APP_INTERCEPTOR,
    useClass:CacheInterceptor
  }],
})
export class AppModule {}
