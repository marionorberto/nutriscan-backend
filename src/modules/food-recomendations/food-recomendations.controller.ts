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
import { FoodRecomendationsService } from './food-recomendations.service';
import { CreateFoodRecomendationDto } from './dtos/create-food-recomendations.dto';
import { UpdateFoodRecomendationDto } from './dtos/update-food-recomendations.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('food-recommendations')
export class FoodRecomendationsController {
  constructor(
    private readonly foodRecomendationsService: FoodRecomendationsService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.foodRecomendationsService.findAll(request);
  }

  @UseGuards(AuthGuard)
  @Get('food-recomendation')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param() id: string, @Req() request: Request) {
    return await this.foodRecomendationsService.findByPk(id, request);
  }

  @Post('create/food-recomendation')
  create(
    @Param() request: Request,
    @Body() createFoodRecomendationDto: CreateFoodRecomendationDto,
  ) {
    return this.foodRecomendationsService.create(
      request,
      createFoodRecomendationDto,
    );
  }

  @UseGuards(AuthGuard)
  @Put('update/food-recomendation')
  async updateOne(
    @Param() id: string,
    @Req() request: Request,
    @Body() updateFoodRecomendationDto: UpdateFoodRecomendationDto,
  ) {
    return await this.foodRecomendationsService.updateOne(
      id,
      request,
      updateFoodRecomendationDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/food-recomendation/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.foodRecomendationsService.deleteOne(id, request);
  }
}
