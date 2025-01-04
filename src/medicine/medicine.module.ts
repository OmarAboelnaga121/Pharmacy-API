import { Module } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { MedicineController } from './medicine.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports:[PrismaModule, CacheModule.register()],
  providers: [MedicineService],
  controllers: [MedicineController]
})
export class MedicineModule {}
