import { Module } from '@nestjs/common';
import { FoodDataService } from './services/food-data.service';
import { FoodDataClientService } from './services/food-data-client.service';

@Module({
  providers: [FoodDataService, FoodDataClientService],
  exports: [FoodDataService],
})
export class FoodDataModule {}
