import { Module } from '@nestjs/common';
import { FoodRecomendationsService } from './food-recomendations.service';
import { FoodRecomendationsController } from './food-recomendations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodRecomendations } from '../../database/entities/food-recomendations/food-recomendation.entity';
@Module({
  imports: [TypeOrmModule.forFeature([FoodRecomendations])],
  controllers: [FoodRecomendationsController],
  providers: [FoodRecomendationsService],
  exports: [FoodRecomendationsService],
})
export class FoodRecomendationsModule {}
