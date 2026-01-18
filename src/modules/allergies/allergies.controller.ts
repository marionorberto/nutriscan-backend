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
import { CreateAllergyAssociationDto } from './dtos/create-allergies-association.dto';

@Controller('allergies')
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @Get('all')
  async findAll() {
    return await this.allergiesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('allergy')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string, @Req() request: Request) {
    return await this.allergiesService.findByPk(id, request);
  }

  @Post('create/allergy')
  create(@Body() createallergyDto: CreateAllergyDto) {
    return this.allergiesService.create(createallergyDto);
  }

  @Post('create-association/allergy')
  createAssociation(@Body() createallergyDto: CreateAllergyAssociationDto) {
    return this.allergiesService.createAssociation(createallergyDto);
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
