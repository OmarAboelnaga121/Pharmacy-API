import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MedicineService } from './medicine.service';

@Controller('medicine')
export class MedicineController {
    constructor(private medicineService : MedicineService) {}


    @Get('all')
    @ApiOperation({summary: "Get All Medicines"})
    @ApiResponse({status: 200, description: "Get All Medicines"})
    @ApiResponse({status: 500, description: "Internal Server Error"})
    async getAllMedicines() {
        return this.medicineService.getAllMedicines();
    }

    @Get('single')
    @ApiOperation({summary: "Get Single Medicine"})
    @ApiResponse({status: 200, description: "Get Single Medicine"})
    @ApiResponse({status: 500, description: "Internal Server Error"})
    async getSingleMedicine(@Query('name') name : string) {
        return this.medicineService.getSingleMedicine(name);
    }
}
