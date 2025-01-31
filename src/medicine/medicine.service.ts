import { BadRequestException, Body, Inject, Injectable, Query, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MedicineDto, updateMedicineDto } from './dto';
import { UserDto } from 'src/user/dto';
import { UserMe } from 'src/auth/decorator/user.decorator';
import { Role } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MedicineService {
    constructor(private prismaService : PrismaService,@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
    // Get All Medicines
    async getAllMedicines() {
        const cachedMedicines = await this.cacheManager.get('medicines');
        if (cachedMedicines) {
            return cachedMedicines;
        }
        const medicines = await this.prismaService.medicines.findMany();
        if (medicines) {
            await this.cacheManager.set('medicines', medicines, 60);
        }
        return medicines;
    }

    // Get Single Medicine
    async getSingleMedicine(medicineId : string) {
        const cachedMedicines = await this.cacheManager.get('medicine');
        if (cachedMedicines) {
            return cachedMedicines;
        }
        const medicine = await this.prismaService.medicines.findUnique(
            {where:{id: parseInt(medicineId)}}
        );
        if (medicine) {
            await this.cacheManager.set('medicines', medicine, 60);
        }
        return medicine;
    }

    // Post Medicine
    async createMedicine(user: UserDto, medicine: MedicineDto){

        
        if(user.role !== 'ADMIN' && user.role !== 'PHARMACIST'){ {
            throw new UnauthorizedException('You are not authorized to perform this action');
        }}

        const newMedicine = await this.prismaService.medicines.create({
            data: medicine
        })

        const notification = await this.prismaService.notification.create({
            data: {
                userId: user.id,
                resourceId: newMedicine.id,
                from: user.name,
                message: "New Medicine Has added",
                type: "NEWMEDICINE",
                targetRole: [Role.ADMIN, Role.PHARMACIST],

            }
        })

        return newMedicine;
    }

    // Edit Medicine
    async editMedicine(@Query('id') id : string, @Body() medicine : updateMedicineDto, @UserMe() user : UserDto) {
        if(user.role !== Role.ADMIN && user.role !== Role.PHARMACIST){
            throw new UnauthorizedException('You are not authorized to perform this action');
        }

        const updatedMedicine = await this.prismaService.medicines.update({
            where: {id: parseInt(id)},
            data: medicine
        })

        const notification = await this.prismaService.notification.create({
            data: {
                userId: user.id,
                resourceId: updatedMedicine.id,
                from: user.name,
                message: "Medicine Has Updated",
                type: "NEWMEDICINE",
                targetRole: [Role.ADMIN, Role.PHARMACIST],
                
            }
        })

        return updatedMedicine;
    }

    // Delete Medicine
    async deleteMedicine(@Query('id') id : string, @UserMe() user : UserDto) {
        if(user.role !== Role.ADMIN && user.role !== Role.PHARMACIST){
            throw new UnauthorizedException('You are not authorized to perform this action');
        }

        const medicine = await this.prismaService.medicines.delete({
            where: {id: parseInt(id)}
        })

        const notification = await this.prismaService.notification.create({
            data: {
                userId: user.id,
                resourceId: medicine.id,
                from: user.name,
                message: "Medicine Has Deleted",
                type: "NEWMEDICINE",
                targetRole: [Role.ADMIN, Role.PHARMACIST],
                
            }
        })

        return "Medicine Deleted Successfully";
    }
}
