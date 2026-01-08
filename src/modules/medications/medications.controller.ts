import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { MedicationService } from './medications.service';
import { CreateMedicationDto } from './dtos/create-medications.dto';
import { UpdateMedicationDto } from './dtos/update-medications.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('medications')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}
  @UseGuards(AuthGuard)
  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.medicationService.findAll(request);
  }

  @UseGuards(AuthGuard)
  @Get('medication')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param() id: string, @Req() request: Request) {
    return await this.medicationService.findByPk(id, request);
  }

  @Post('create/medication')
  create(
    @Param() request: Request,
    @Body() createMedicationDto: CreateMedicationDto,
  ) {
    return this.medicationService.create(request, createMedicationDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/medication')
  async updateOne(
    @Param() id: string,
    @Req() request: Request,
    @Body() updateMedicationDto: UpdateMedicationDto,
  ) {
    return await this.medicationService.updateOne(
      id,
      request,
      updateMedicationDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/medication/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.medicationService.deleteOne(id, request);
  }
}
