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
import { UsersService } from './users.service';
import { CreateUsersDto } from './dtos/create-users.dto';
import { UpdateUsersDto } from './dtos/update-users.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UsersService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.usersServices.findAll();
  }

  // @UseGuards(AuthGuard)  -> ask for token
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

  @UseGuards(AuthGuard)
  @Put('password/user/update')
  async updatePassword(
    @Req() request: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.usersServices.updatePassword(request, updatePasswordDto);
  }

  // @UseGuards(AuthGuard)
  // @Put('password/user/update')
  // async updatePassword(
  //   @Req() request: Request,
  //   @Body() updatePasswordDto: UpdatePasswordDto,
  // ) {
  //   return await this.usersServices.updatePassword(request, updatePasswordDto);
  // }

  // @UseGuards(AuthGuard)
  // @Put('password/user/update')
  // async updatePassword(
  //   @Req() request: Request,
  //   @Body() updatePasswordDto: UpdatePasswordDto,
  // ) {
  //   return await this.usersServices.updatePassword(request, updatePasswordDto);
  // }

  // @UseGuards(AuthGuard)
  // @Put('password/user/update')
  // async updatePassword(
  //   @Req() request: Request,
  //   @Body() updatePasswordDto: UpdatePasswordDto,
  // ) {
  //   return await this.usersServices.updatePassword(request, updatePasswordDto);
  // }
}
