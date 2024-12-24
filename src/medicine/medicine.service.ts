import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MedicineDto } from './dto';
import { UserDto } from 'src/user/dto';

@Injectable()
export class MedicineService {
    constructor(private prismaService : PrismaService) {}
    // Get All Medicines
    async getAllMedicines() {
        const medicines = await this.prismaService.medicines.findMany();
        return medicines
    }

    // Get Single Medicine
    async getSingleMedicine(medicinieName : string) {
        const medicine = await this.prismaService.medicines.findUnique(
            {where:{medicinieName: medicinieName}}
        );
        
        return medicine;
    }

    // Post Medicine
    async createMedicine(user: UserDto, medicine: MedicineDto){
        console.log(user);
        
        if(user.role !== 'ADMIN' && user.role !== 'PHARMACIST'){ {
            throw new UnauthorizedException('You are not authorized to perform this action');
        }}

        const newMedicine = await this.prismaService.medicines.create({
            data: medicine
        })

        return newMedicine;
    }

    // Edit Medicine

    // Delete Medicine
}
