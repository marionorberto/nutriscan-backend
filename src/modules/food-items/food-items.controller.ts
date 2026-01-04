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
import { FoodItemsService } from './food-items.service';
import { CreateUsersDto } from './dtos/create-food-items.dto';
import { UpdateUsersDto } from './dtos/update-food-items.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('foodItems')
export class FoodItemsController {
  constructor(private readonly usersServices: FoodItemsService) {}

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
