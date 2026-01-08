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
import { MedicationScheduleService } from './medication-schedules.service';
import { CreateMedicationScheduleDto } from './dtos/create-medication-schedules.dto';
import { UpdateMedicationScheduleDto } from './dtos/update-medication-schedules.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('medication-schedules')
export class MedicationScheduleController {
  constructor(
    private readonly medicationScheduleService: MedicationScheduleService,
  ) {}
  @UseGuards(AuthGuard)
  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.medicationScheduleService.findAll(request);
  }

  @UseGuards(AuthGuard)
  @Get('medication-schedule')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param() id: string, @Req() request: Request) {
    return await this.medicationScheduleService.findByPk(id, request);
  }

  @Post('create/medication-schedule')
  create(
    @Param() request: Request,
    @Body() createMedicationScheduleDto: CreateMedicationScheduleDto,
  ) {
    return this.medicationScheduleService.create(
      request,
      createMedicationScheduleDto,
    );
  }

  @UseGuards(AuthGuard)
  @Put('update/medication-schedule')
  async updateOne(
    @Param() id: string,
    @Req() request: Request,
    @Body() updateMedicationScheduleDto: UpdateMedicationScheduleDto,
  ) {
    return await this.medicationScheduleService.updateOne(
      id,
      request,
      updateMedicationScheduleDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/medication-schedule/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.medicationScheduleService.deleteOne(id, request);
  }
}
