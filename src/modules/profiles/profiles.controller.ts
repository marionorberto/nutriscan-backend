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
import { ProfilesService } from './profiles.service';
import { CreateProfilesDto } from './dtos/create-profiles.dto';
import { UpdateProfilesDto } from './dtos/update-profiles.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';
import { CreateProfilesAdminDto } from './dtos/create-profiles-admin.dto';
import { UpdateProfilesAdminDto } from './dtos/update-profiles-admin.dto';

@Controller('profiles')
export class profilesController {
  constructor(private readonly profilesServices: ProfilesService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.profilesServices.findAll();
  }

  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  async findByPk(@Req() request: Request) {
    return await this.profilesServices.findByPk(request);
  }

  @Get('profile-admin')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  async findprofileAdmin(@Req() request: Request) {
    return await this.profilesServices.findProfileAdmin(request);
  }

  @Post('create-admin/profile')
  createAdmin(@Body() createprofileAdminDto: CreateProfilesAdminDto) {
    console.log(createprofileAdminDto);
    return this.profilesServices.createAdmin(createprofileAdminDto);
  }

  @Post('create/profile')
  create(@Body() createprofileDto: CreateProfilesDto) {
    return this.profilesServices.create(createprofileDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/profile')
  async updateOne(
    @Req() request: Request,
    @Body() updateprofilesDto: UpdateProfilesDto,
  ) {
    return await this.profilesServices.updateOne(request, updateprofilesDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/profile-admin')
  async updateOneAdmin(
    @Req() request: Request,
    @Body() updateProfilesAdminDto: UpdateProfilesAdminDto,
  ) {
    return await this.profilesServices.updateOneAdmin(
      request,
      updateProfilesAdminDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/profile/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.profilesServices.deleteOne(id);
  }
}
