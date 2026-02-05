// =============================================
// Interfaces da API LogMeal (Respostas diretas)
// =============================================

export interface FoodFamily {
  id: number;
  name: string;
  prob?: number;
}

export interface FoodType {
  id: number;
  name: string;
}

export interface NutriScore {
  nutri_score_category: string;
  nutri_score_standardized: number;
}

export interface Subclass {
  id: number;
  name: string;
  foodFamily: FoodFamily[];
  foodType: FoodType;
  hasNutriScore: boolean;
  nutri_score: NutriScore;
  prob: number;
}

export interface RecognitionResult {
  id: number;
  name: string;
  foodFamily: FoodFamily[];
  foodType: FoodType;
  hasNutriScore: boolean;
  nutri_score: NutriScore;
  prob: number;
  subclasses: Subclass[];
}

export interface CenterPoint {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SegmentationResult {
  food_item_position: number;
  recognition_results: RecognitionResult[];
  polygon: number[];
  center: CenterPoint;
  contained_bbox: BoundingBox;
}

export interface FoodRecognitionResponse {
  foodFamily: FoodFamily[];
  foodType: FoodType;
  imageId: number;
  model_versions: Record<string, string>;
  occasion: string;
  occasion_info: {
    id: number | null;
    translation: string;
  };
  processed_image_size: {
    height: number;
    width: number;
  };
  segmentation_results: SegmentationResult[];
}

export interface Nutrient {
  label: string;
  quantity: number;
  unit: string;
}

export interface DailyIntakeReference {
  label: string;
  level: string;
  percent: number;
}

export interface NutritionalInfo {
  calories: number;
  dailyIntakeReference: Record<string, DailyIntakeReference>;
  totalNutrients: Record<string, Nutrient>;
}

export interface NutritionPerItem {
  food_item_position: number;
  hasNutriScore: boolean;
  hasNutritionalInfo: boolean;
  id: number;
  nutri_score: NutriScore;
  nutritional_info: NutritionalInfo;
  serving_size: number;
}

export interface NutritionResponse {
  foodName: string[];
  hasNutritionalInfo: boolean;
  ids: number[];
  imageId: number;
  image_nutri_score: NutriScore;
  nutritional_info: NutritionalInfo;
  nutritional_info_per_item: NutritionPerItem[];
  serving_size: number;
}

// =============================================
// Interfaces para Dados Processados
// =============================================

export interface ProcessedFoodItem {
  id: number;
  name: string;
  probability: number;
  foodFamily: FoodFamily[];
  foodType: FoodType;
  hasNutriScore: boolean;
  nutriScore: NutriScore;
  position: number;
  subclasses: Subclass[];
  polygon: number[];
  center: CenterPoint;
  boundingBox: BoundingBox;
  confidence: string;
  estimatedServing?: number;
  nutrition?: {
    calories: number;
    nutrients: Record<string, Nutrient>;
    dailyIntake: Record<string, DailyIntakeReference>;
  };
}

export interface Macronutrient {
  total: number;
  unit: string;
  dailyPercent?: number;
}

export interface Micronutrient {
  total: number;
  unit: string;
  dailyPercent?: number;
}

export interface Vitamins {
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminK: number;
}

export interface NutritionalSummary {
  totalCalories: number;
  macronutrients: {
    carbs: Macronutrient;
    protein: Macronutrient;
    fat: Macronutrient;
    saturatedFat: Macronutrient;
    sugars: Macronutrient;
    fiber: Macronutrient;
  };
  micronutrients: {
    sodium: Micronutrient;
    cholesterol: Micronutrient;
    calcium: Micronutrient;
    iron: Micronutrient;
    potassium: Micronutrient;
  };
  vitamins: Vitamins;
  imageNutriScore: NutriScore;
  overallScore: number;
  healthScore: number;
}

export interface ProcessedFoodResponse {
  occasion: string;
  foodItems: ProcessedFoodItem[];
  nutritionalSummary: NutritionalSummary;
  categorizedFoods: Record<string, ProcessedFoodItem[]>;
  topFoods: ProcessedFoodItem[];
  imageInfo: {
    id: number;
    processedSize: {
      height: number;
      width: number;
    };
  };
  modelVersions: Record<string, string>;
  timestamp: string;
  success: boolean;
}

// =============================================
// Interfaces para Requisições
// =============================================

export interface FoodAnalysisRequest {
  image: string;
  mimeType?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
