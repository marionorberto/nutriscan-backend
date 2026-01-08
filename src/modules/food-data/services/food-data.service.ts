import { Injectable } from '@nestjs/common';
import { FoodDataClientService } from './food-data-client.service';
import { FoodNutrition } from '../interfaces/food-nutrition.interface';

@Injectable()
export class FoodDataService {
  constructor(private readonly foodDataClient: FoodDataClientService) {}

  async getNutrition(foodName: string): Promise<FoodNutrition | null> {
    return this.foodDataClient.fetchFood(foodName);
  }

  async getNutritionBatch(foodNames: string[]): Promise<FoodNutrition[]> {
    const results: FoodNutrition[] = [];

    for (const name of foodNames) {
      const nutrition = await this.getNutrition(name);
      if (nutrition) {
        results.push(nutrition);
      }
    }

    return results;
  }
}
