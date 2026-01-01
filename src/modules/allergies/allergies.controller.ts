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
import { CreateAllergyDto } from './dtos/create-allergies.dto';
import { UpdateAllergyDto } from './dtos/update-allergies.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';
import { AllergiesService } from './allergies.service';

@Controller('allergies')
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.allergiesService.findAll(request);
  }

  @UseGuards(AuthGuard)
  @Get('allergy')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string, @Req() request: Request) {
    return await this.allergiesService.findByPk(id, request);
  }

  @Post('create/allergy')
  create(@Req() request: Request, @Body() createallergyDto: CreateAllergyDto) {
    return this.allergiesService.create(request, createallergyDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/allergy')
  async updateOne(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() updateallergysDto: UpdateAllergyDto,
  ) {
    return await this.allergiesService.updateOne(
      id,
      request,
      updateallergysDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/allergy/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.allergiesService.deleteOne(id, request);
  }
}
