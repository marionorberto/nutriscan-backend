import { Module } from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { FoodItemsController } from './food-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodItems } from '../../database/entities/food-items/food-item.entity';
@Module({
  imports: [TypeOrmModule.forFeature([FoodItems])],
  controllers: [FoodItemsController],
  providers: [FoodItemsService],
  exports: [FoodItemsService],
})
export class FoodItemsModule {}
