import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DiabeteProfilesService } from './diabeti-profiles.service';
import { CreateDiabeteProfileDto } from './dtos/create-diabete-profiles.dto';
import { UpdateDiabeteProfileDto } from './dtos/update-diabete-profiles.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('diabete-profiles')
export class DiabeteProfilesController {
  constructor(
    private readonly diabeteProfilesService: DiabeteProfilesService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('diabete-profile')
  async findOne(@Req() request: Request) {
    return await this.diabeteProfilesService.findOne(request);
  }

  @Post('create/diabete-profile')
  create(@Body() createClinicalProfileDto: CreateDiabeteProfileDto) {
    return this.diabeteProfilesService.create(createClinicalProfileDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/diabete-profile')
  async updateOne(
    @Req() request: Request,
    @Body() updateDiabeteProfileDto: UpdateDiabeteProfileDto,
  ) {
    return await this.diabeteProfilesService.updateOne(
      request,
      updateDiabeteProfileDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/diabete-profile/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.diabeteProfilesService.deleteOne(id, request);
  }
}
