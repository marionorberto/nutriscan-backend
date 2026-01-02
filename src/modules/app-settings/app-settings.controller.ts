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
import { AppSettingsService } from './app-settings.service';
import { CreateAppSettingsDto } from './dtos/create-app-settings.dto';
import { UpdateAppSettingsDto } from './dtos/update-app-settings.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('app-settings')
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  async findAll(@Req() request: Request) {
    return await this.appSettingsService.findAll(request);
  }

  @UseGuards(AuthGuard)
  @Get('setting/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string, @Req() request: Request) {
    return await this.appSettingsService.findByPk(id, request);
  }

  @Post('create/setting')
  create(@Req() request: Request, @Body() createUserDto: CreateAppSettingsDto) {
    return this.appSettingsService.create(request, createUserDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/setting')
  async updateOne(
    @Param() id: string,
    @Req() request: Request,
    @Body() updateUsersDto: UpdateAppSettingsDto,
  ) {
    return await this.appSettingsService.updateOne(id, request, updateUsersDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/setting/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.appSettingsService.deleteOne(id, request);
  }
}
