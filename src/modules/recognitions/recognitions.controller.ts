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
import { RecognitionService } from './recognitions.service';
import { CreateUsersDto } from './dtos/create-recognitions.dto';
import { UpdateUsersDto } from './dtos/update-recognitions.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('users')
export class RecognitionController {
  constructor(private readonly usersServices: RecognitionService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.usersServices.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('user')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Req() request: Request) {
    return await this.usersServices.findByPk(request);
  }

  @Post('create/user')
  create(@Body() createUserDto: CreateUsersDto) {
    return this.usersServices.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/user')
  async updateOne(
    @Req() request: Request,
    @Body() updateUsersDto: UpdateUsersDto,
  ) {
    return await this.usersServices.updateOne(request, updateUsersDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/user/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.usersServices.deleteOne(id);
  }
}
