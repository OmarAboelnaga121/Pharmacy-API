import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MedicineService } from './medicine.service';
import { MedicineDto, updateMedicineDto } from './dto';
import { UserMe } from 'src/auth/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/user/dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('medicine')
@UseGuards(ThrottlerGuard)
@UseGuards(AuthGuard('jwt'))
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

    // Update Medicine
    @Patch('update')
    @ApiBearerAuth()
    @ApiOperation({summary: "Update Medicine"})
    @ApiResponse({status: 200, description: "Update Medicine"})
    @ApiResponse({status: 500, description: "Internal Server Error"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiBody({type: MedicineDto})
    async editMedicine(@Query('id') id : string, @Body() medicine : updateMedicineDto, @UserMe() user : UserDto) {
        return this.medicineService.editMedicine(id, medicine, user);
    }

    // Delete Medicine
    @Delete('delete')
    @ApiBearerAuth()
    @ApiOperation({summary: "Delete Medicine"})
    @ApiResponse({status: 200, description: "Delete Medicine"})
    @ApiResponse({status: 500, description: "Internal Server Error"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    async deleteMedicine(@Query('id') id : string, @UserMe() user : UserDto) {
        return this.medicineService.deleteMedicine(id, user);
    }
}

