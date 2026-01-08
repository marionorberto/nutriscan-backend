export interface FoodNutrition {
  name: string;
  calories: number; // kcal / 100g
  carbs: number; // g / 100g
  sugar: number; // g / 100g
  fiber: number; // g / 100g
  protein: number; // g / 100g
  fat: number; // g / 100g
  source: 'OPEN_FOOD_FACTS';
}
