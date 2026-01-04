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
  @Get('clinical-profile/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Req() request: Request) {
    return await this.diabeteProfilesService.findOne(request);
  }

  @Post('create/clinical-profile')
  create(
    @Req() request: Request,
    @Body() createClinicalProfileDto: CreateDiabeteProfileDto,
  ) {
    return this.diabeteProfilesService.create(
      request,
      createClinicalProfileDto,
    );
  }

  @UseGuards(AuthGuard)
  @Put('update/clinical-profile')
  async updateOne(
    @Param() id: string,
    @Req() request: Request,
    @Body() updateDiabeteProfileDto: UpdateDiabeteProfileDto,
  ) {
    return await this.diabeteProfilesService.updateOne(
      id,
      request,
      updateDiabeteProfileDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/clinical-profile/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.diabeteProfilesService.deleteOne(id, request);
  }
}
