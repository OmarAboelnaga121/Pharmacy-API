import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MedicineService } from './medicine.service';
import { MedicineDto } from './dto';
import { UserMe } from 'src/auth/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/user/dto';

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

    // Post Medicine
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    @ApiOperation({summary: "Create Medicine"})
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "Create Medicine"})
    @ApiResponse({status: 500, description: "Internal Server Error"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiBody({type: MedicineDto})
    async createMedicine(@UserMe() user : UserDto ,@Body() medicine : MedicineDto) {
        return this.medicineService.createMedicine(user, medicine);
    }
}
