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
import { DietaryRoutineService } from './dietary-routines.service';
import { CreateDietaryRoutineDto } from './dtos/create-dietary-routines.dto';
import { UpdateDietaryRoutineDto } from './dtos/update-dietary-routines.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('dietary-routines')
export class DietaryRoutineController {
  constructor(private readonly dietaryRoutineService: DietaryRoutineService) {}

  @UseGuards(AuthGuard)
  @Get('dietary-routine/')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Req() request: Request) {
    return await this.dietaryRoutineService.findOne(request);
  }

  @Post('create/dietary-routine')
  create(@Body() createDietaryRoutineDto: CreateDietaryRoutineDto) {
    return this.dietaryRoutineService.create(createDietaryRoutineDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/dietary-routine')
  async updateOne(
    @Param() id: string,
    @Req() request: Request,
    @Body() updateDietaryRoutineDto: UpdateDietaryRoutineDto,
  ) {
    return await this.dietaryRoutineService.updateOne(
      id,
      request,
      updateDietaryRoutineDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/dietary-routine/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.dietaryRoutineService.deleteOne(id, request);
  }
}
