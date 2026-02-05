import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Importando todas as interfaces
import {
  FoodRecognitionResponse,
  NutritionResponse,
  ProcessedFoodItem,
  NutritionalSummary,
  ProcessedFoodResponse,
} from './interfaces/logmeal.interface';

@Injectable()
export class LogMealService {
  private readonly logger = new Logger(LogMealService.name);
  private readonly apiUrl = 'https://api.logmeal.com/v2';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = process.env.LOGMEAL_API_KEY;

    if (!this.apiKey) {
      this.logger.warn('LOGMEAL_API_KEY not found in environment variables');
    }
  }

  async recognizeFoodFromImage(
    imageBuffer: Buffer,
    mimeType: string,
  ): Promise<FoodRecognitionResponse> {
    try {
      this.logger.log('Starting food recognition process...');

      // Criar arquivo temporário
      const tempDir = os.tmpdir();
      const tempFileName = `food_image_${Date.now()}.${this.getExtensionFromMimeType(mimeType)}`;
      const tempFilePath = path.join(tempDir, tempFileName);

      // Salvar buffer em arquivo temporário
      await fs.promises.writeFile(tempFilePath, imageBuffer);

      // Usar FormData do Node.js
      const FormData = require('form-data');
      const formData = new FormData();

      // Adicionar arquivo ao formData
      formData.append('image', fs.createReadStream(tempFilePath), {
        filename: tempFileName,
        contentType: mimeType,
      });

      this.logger.log(
        `Sending request to LogMeal API with image size: ${imageBuffer.length} bytes`,
      );

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/image/segmentation/complete/v1.0?language=eng`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Authorization: `Bearer ${this.apiKey}`,
              accept: 'application/json',
            },
            timeout: 30000,
          },
        ),
      );

      // Limpar arquivo temporário
      await fs.promises
        .unlink(tempFilePath)
        .catch((err) =>
          this.logger.warn(`Failed to delete temp file: ${err.message}`),
        );

      this.logger.log(
        `Food recognition successful. Image ID: ${response.data.imageId}`,
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(
        'Error recognizing food:',
        error.response?.data || error.message,
      );

      if (error.response) {
        throw new Error(
          `LogMeal API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`,
        );
      }

      throw new Error(`Failed to recognize food: ${error.message}`);
    }
  }

  async getNutritionalInfo(imageId: number): Promise<NutritionResponse> {
    try {
      this.logger.log(`Getting nutritional info for image ID: ${imageId}`);

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/nutrition/recipe/nutritionalInfo`,
          { imageId },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              accept: 'application/json',
              'content-type': 'application/json',
            },
            timeout: 30000,
          },
        ),
      );

      this.logger.log(`Nutritional info retrieved for image ID: ${imageId}`);

      return response.data;
    } catch (error: any) {
      this.logger.error(
        'Error getting nutritional info:',
        error.response?.data || error.message,
      );

      if (error.response) {
        throw new Error(
          `LogMeal API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`,
        );
      }

      throw new Error(`Failed to get nutritional info: ${error.message}`);
    }
  }

  async processFoodImage(
    imageBuffer: Buffer,
    mimeType: string,
  ): Promise<ProcessedFoodResponse> {
    try {
      // Verificar tamanho da imagem (LogMeal tem limite de 5MB)
      if (imageBuffer.length > 5 * 1024 * 1024) {
        throw new Error('Image size exceeds 5MB limit');
      }

      // Passo 1: Reconhecimento dos alimentos
      this.logger.log('Step 1: Recognizing food from image...');
      const recognitionData = await this.recognizeFoodFromImage(
        imageBuffer,
        mimeType,
      );

      // Passo 2: Obter informações nutricionais
      this.logger.log('Step 2: Getting nutritional information...');
      const nutritionData = await this.getNutritionalInfo(
        recognitionData.imageId,
      );

      // Passo 3: Processar e organizar os dados
      this.logger.log('Step 3: Processing and organizing data...');
      return this.processFoodData(recognitionData, nutritionData);
    } catch (error: any) {
      this.logger.error('Error processing food image:', error);
      throw error;
    }
  }

  async processFoodImageBase64(
    base64Image: string,
    mimeType: string = 'image/jpeg',
  ): Promise<ProcessedFoodResponse> {
    const base64Data = base64Image.includes('base64,')
      ? base64Image.split('base64,')[1]
      : base64Image;

    const imageBuffer = Buffer.from(base64Data, 'base64');

    return await this.processFoodImage(imageBuffer, mimeType);
  }

  private processFoodData(
    recognitionData: FoodRecognitionResponse,
    nutritionData: NutritionResponse,
  ): ProcessedFoodResponse {
    try {
      // Extrair alimentos únicos
      const foodItems = this.extractUniqueFoodItems(recognitionData);

      // Calcular resumo nutricional
      const nutritionalSummary =
        this.calculateNutritionalSummary(nutritionData);

      // Organizar por categorias
      const categorizedFoods = this.categorizeFoodItems(foodItems);

      // Identificar alimentos principais
      const topFoods = this.identifyTopFoods(foodItems);

      // Calcular quantidade estimada de cada item
      const foodItemsWithServing = this.calculateEstimatedServings(
        foodItems,
        nutritionData,
      );

      return {
        occasion: recognitionData.occasion,
        foodItems: foodItemsWithServing,
        nutritionalSummary,
        categorizedFoods,
        topFoods: topFoods.slice(0, 5),
        imageInfo: {
          id: recognitionData.imageId,
          processedSize: recognitionData.processed_image_size,
        },
        modelVersions: recognitionData.model_versions,
        timestamp: new Date().toISOString(),
        success: true,
      };
    } catch (error: any) {
      this.logger.error('Error processing food data:', error);
      throw error;
    }
  }

  private extractUniqueFoodItems(
    recognitionData: FoodRecognitionResponse,
  ): ProcessedFoodItem[] {
    const itemsMap = new Map<number, ProcessedFoodItem>();

    recognitionData.segmentation_results.forEach((segment) => {
      const topResult = segment.recognition_results[0]; // Primeira sugestão (maior probabilidade)

      if (topResult && !itemsMap.has(topResult.id)) {
        itemsMap.set(topResult.id, {
          id: topResult.id,
          name: topResult.name,
          probability: topResult.prob,
          foodFamily: topResult.foodFamily,
          foodType: topResult.foodType,
          hasNutriScore: topResult.hasNutriScore,
          nutriScore: topResult.nutri_score,
          position: segment.food_item_position,
          subclasses: topResult.subclasses,
          polygon: segment.polygon,
          center: segment.center,
          boundingBox: segment.contained_bbox,
          confidence: this.calculateConfidenceLevel(topResult.prob),
        });
      }
    });

    return Array.from(itemsMap.values()).sort(
      (a, b) => b.probability - a.probability,
    );
  }

  private calculateEstimatedServings(
    foodItems: ProcessedFoodItem[],
    nutritionData: NutritionResponse,
  ): ProcessedFoodItem[] {
    const nutritionPerItem = nutritionData.nutritional_info_per_item || [];

    return foodItems.map((item) => {
      const itemNutrition = nutritionPerItem.find(
        (n) => n.food_item_position === item.position || n.id === item.id,
      );

      return {
        ...item,
        estimatedServing: itemNutrition?.serving_size || 100,
        nutrition: itemNutrition
          ? {
              calories: itemNutrition.nutritional_info?.calories || 0,
              nutrients: itemNutrition.nutritional_info?.totalNutrients || {},
              dailyIntake:
                itemNutrition.nutritional_info?.dailyIntakeReference || {},
            }
          : undefined,
      };
    });
  }

  private calculateNutritionalSummary(
    nutritionData: NutritionResponse,
  ): NutritionalSummary {
    const totalNutrients = nutritionData.nutritional_info?.totalNutrients || {};
    const dailyIntake =
      nutritionData.nutritional_info?.dailyIntakeReference || {};

    return {
      totalCalories: nutritionData.nutritional_info?.calories || 0,
      macronutrients: {
        carbs: {
          total: totalNutrients.CHOCDF?.quantity || 0,
          unit: totalNutrients.CHOCDF?.unit || 'g',
          dailyPercent: dailyIntake.CHOCDF?.percent || 0,
        },
        protein: {
          total: totalNutrients.PROCNT?.quantity || 0,
          unit: totalNutrients.PROCNT?.unit || 'g',
          dailyPercent: dailyIntake.PROCNT?.percent || 0,
        },
        fat: {
          total: totalNutrients.FAT?.quantity || 0,
          unit: totalNutrients.FAT?.unit || 'g',
          dailyPercent: dailyIntake.FAT?.percent || 0,
        },
        saturatedFat: {
          total: totalNutrients.FASAT?.quantity || 0,
          unit: totalNutrients.FASAT?.unit || 'g',
          dailyPercent: dailyIntake.FASAT?.percent || 0,
        },
        sugars: {
          total: totalNutrients.SUGAR?.quantity || 0,
          unit: totalNutrients.SUGAR?.unit || 'g',
          dailyPercent: dailyIntake.SUGAR?.percent || 0,
        },
        fiber: {
          total: totalNutrients.FIBTG?.quantity || 0,
          unit: totalNutrients.FIBTG?.unit || 'g',
        },
      },
      micronutrients: {
        sodium: {
          total: totalNutrients.NA?.quantity || 0,
          unit: totalNutrients.NA?.unit || 'mg',
          dailyPercent: dailyIntake.NA?.percent || 0,
        },
        cholesterol: {
          total: totalNutrients.CHOLE?.quantity || 0,
          unit: totalNutrients.CHOLE?.unit || 'mg',
        },
        calcium: {
          total: totalNutrients.CA?.quantity || 0,
          unit: totalNutrients.CA?.unit || 'mg',
        },
        iron: {
          total: totalNutrients.FE?.quantity || 0,
          unit: totalNutrients.FE?.unit || 'mg',
        },
        potassium: {
          total: totalNutrients.K?.quantity || 0,
          unit: totalNutrients.K?.unit || 'mg',
        },
      },
      vitamins: {
        vitaminA: totalNutrients.VITA_RAE?.quantity || 0,
        vitaminC: totalNutrients.VITC?.quantity || 0,
        vitaminD: totalNutrients.VITD?.quantity || 0,
        vitaminE: totalNutrients.TOCPHA?.quantity || 0,
        vitaminK: totalNutrients.VITK1?.quantity || 0,
      },
      imageNutriScore: nutritionData.image_nutri_score || {
        nutri_score_category: 'Unknown',
        nutri_score_standardized: 0,
      },
      overallScore: this.calculateOverallScore(nutritionData),
      healthScore: this.calculateHealthScore(totalNutrients, dailyIntake),
    };
  }

  private categorizeFoodItems(
    foodItems: ProcessedFoodItem[],
  ): Record<string, ProcessedFoodItem[]> {
    const categories: Record<string, ProcessedFoodItem[]> = {};

    foodItems.forEach((item) => {
      if (item.foodFamily && item.foodFamily.length > 0) {
        item.foodFamily.forEach((family) => {
          if (!categories[family.name]) {
            categories[family.name] = [];
          }
          // Evitar duplicatas
          if (
            !categories[family.name].some((existing) => existing.id === item.id)
          ) {
            categories[family.name].push(item);
          }
        });
      } else {
        // Categoria padrão para itens sem família
        if (!categories['Other']) {
          categories['Other'] = [];
        }
        categories['Other'].push(item);
      }
    });

    return categories;
  }

  private identifyTopFoods(
    foodItems: ProcessedFoodItem[],
  ): ProcessedFoodItem[] {
    return foodItems.slice(0, Math.min(10, foodItems.length));
  }

  private calculateOverallScore(nutritionData: NutritionResponse): number {
    if (
      !nutritionData.nutritional_info_per_item ||
      nutritionData.nutritional_info_per_item.length === 0
    ) {
      return 0;
    }

    const scores = nutritionData.nutritional_info_per_item
      .filter((item) => item.nutri_score)
      .map((item) => item.nutri_score.nutri_score_standardized || 0);

    return scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        )
      : 0;
  }

  private calculateHealthScore(totalNutrients: any, dailyIntake: any): number {
    // Algoritmo simplificado para calcular uma pontuação de saúde
    let score = 100;

    // Penalizar alto sódio
    if (dailyIntake.NA?.percent > 50) score -= 20;
    else if (dailyIntake.NA?.percent > 75) score -= 40;

    // Penalizar alto açúcar
    if (dailyIntake.SUGAR?.percent > 50) score -= 15;
    else if (dailyIntake.SUGAR?.percent > 75) score -= 30;

    // Bonificar alta fibra
    if (totalNutrients.FIBTG?.quantity > 10) score += 10;

    // Bonificar baixa gordura saturada
    if (dailyIntake.FASAT?.percent < 25) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private calculateConfidenceLevel(probability: number): string {
    if (probability >= 0.8) return 'Very High';
    if (probability >= 0.6) return 'High';
    if (probability >= 0.4) return 'Medium';
    if (probability >= 0.2) return 'Low';
    return 'Very Low';
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };

    return mimeToExt[mimeType] || 'jpg';
  }
}
