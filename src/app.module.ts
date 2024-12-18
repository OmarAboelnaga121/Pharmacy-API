import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store'; 


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), CacheModule.register({
    isGlobal: true,
    store: redisStore as any,
    host:'localhost',
    port: 6379,
    ttl: 60,
  })],
  controllers: [],
  providers: [{
    provide:APP_INTERCEPTOR,
    useClass:CacheInterceptor
  }],
})
export class AppModule {}
