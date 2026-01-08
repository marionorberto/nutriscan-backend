import { Injectable } from '@nestjs/common';
import { FoodNutrition } from '../interfaces/food-nutrition.interface';

@Injectable()
export class FoodDataClientService {
  private readonly BASE_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

  async fetchFood(foodName: string): Promise<FoodNutrition | null> {
    const url =
      `${this.BASE_URL}?search_terms=${encodeURIComponent(foodName)}` +
      `&search_simple=1&action=process&json=1&page_size=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      return null;
    }

    const product = data.products[0];
    const nutriments = product.nutriments ?? {};

    return {
      name: product.product_name || foodName,
      calories: nutriments['energy-kcal_100g'] ?? 0,
      carbs: nutriments['carbohydrates_100g'] ?? 0,
      sugar: nutriments['sugars_100g'] ?? 0,
      fiber: nutriments['fiber_100g'] ?? 0,
      protein: nutriments['proteins_100g'] ?? 0,
      fat: nutriments['fat_100g'] ?? 0,
      source: 'OPEN_FOOD_FACTS',
    };
  }
}
