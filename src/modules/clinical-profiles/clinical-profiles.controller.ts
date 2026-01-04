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
import { ClinicalProfilesService } from './clinical-profiles.service';
import { CreateClinicalProfileDto } from './dtos/create-clinical-profiles.dto';
import { UpdateClinicalProfileDto } from './dtos/update-clinical-profiles.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('clinical-profiles')
export class ClinicalProfileController {
  constructor(
    private readonly clinicalProfileService: ClinicalProfilesService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('clinical-profile/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Req() request: Request) {
    return await this.clinicalProfileService.findOne(request);
  }

  @Post('create/clinical-profile')
  create(
    @Req() request: Request,
    @Body() createClinicalProfileDto: CreateClinicalProfileDto,
  ) {
    return this.clinicalProfileService.create(
      request,
      createClinicalProfileDto,
    );
  }

  @UseGuards(AuthGuard)
  @Put('update/clinical-profile')
  async updateOne(
    @Param() id: string,
    @Req() request: Request,
    @Body() updateClinicalProfileDto: UpdateClinicalProfileDto,
  ) {
    return await this.clinicalProfileService.updateOne(
      id,
      request,
      updateClinicalProfileDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/clinical-profile/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.clinicalProfileService.deleteOne(id, request);
  }
}
