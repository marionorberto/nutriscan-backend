import { Module } from '@nestjs/common';
import { FoodRecomendationsService } from './food-recomendations.service';
import { FoodRecomendationsController } from './food-recomendations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodRecomendations } from '../../database/entities/food-recomendations/food-recomendation.entity';
import { UsersService } from '@modules/users/users.service';
import { EmailService } from 'shared/email/email.service';
@Module({
  imports: [TypeOrmModule.forFeature([FoodRecomendations])],
  controllers: [FoodRecomendationsController],
  providers: [FoodRecomendationsService, UsersService, EmailService],
  exports: [FoodRecomendationsService, UsersService, EmailService],
})
export class FoodRecomendationsModule {}
