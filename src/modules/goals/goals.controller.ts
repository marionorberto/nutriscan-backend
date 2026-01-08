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
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dtos/create-goals.dto';
import { UpdateGoalDto } from './dtos/update-goals.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}
  @UseGuards(AuthGuard)
  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.goalsService.findAll(request);
  }

  @UseGuards(AuthGuard)
  @Get('goal')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param() id: string, @Req() request: Request) {
    return await this.goalsService.findByPk(id, request);
  }

  @Post('create/goal')
  create(@Param() request: Request, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(request, createGoalDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/goal')
  async updateOne(
    @Param() id: string,
    @Req() request: Request,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return await this.goalsService.updateOne(id, request, updateGoalDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/goal/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.goalsService.deleteOne(id, request);
  }
}
