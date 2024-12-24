import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

    // Edit Medicine

    // Delete Medicine
}
