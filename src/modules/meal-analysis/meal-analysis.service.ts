// src/services/MealAnalysis.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, ILike } from 'typeorm';
import { MealAnalysis } from '../../database/entities/meal-analyses/meal-analysis.entity';
import { CreateAnalysisDto } from './dtos/create-meal-analysis.dto';

@Injectable()
export class MealAnalysisService {
  constructor(
    @InjectRepository(MealAnalysis)
    private mealAnalysisRepository: Repository<MealAnalysis>,
  ) {}

  async saveAnalysis(
    userId: string,
    evaluationData: CreateAnalysisDto,
  ): Promise<{ success: boolean; analysisId: string }> {
    try {
      const mealAnalysis = this.mealAnalysisRepository.create({
        user: {
          id: userId,
        },
        occasion: evaluationData.occasion,
        mealTimestamp: new Date(evaluationData.timestamp),
        success: evaluationData.success,
        processedData: {
          identifiedFoods: evaluationData.identifiedFoods,
          mealNutrition: evaluationData.mealNutrition,
          insights: evaluationData.insights,
          // originalData: evaluationData.originalData,
        },
        aiAnalysis: evaluationData.analysis,
        totalCalories: evaluationData.mealNutrition.totalCalories,
        totalCarbs: evaluationData.mealNutrition.totalCarbs,
        totalNetCarbs: evaluationData.mealNutrition.totalNetCarbs,
        totalFiber: evaluationData.mealNutrition.totalFiber,
        totalProtein: evaluationData.mealNutrition.totalProtein,
        totalFat: evaluationData.mealNutrition.totalFat,
        diabeticSuitability: evaluationData.mealNutrition.diabeticSuitability,
        safetyStatus:
          evaluationData.analysis.analysisSummary.overallSafetyStatus,
        isRecommended:
          evaluationData.analysis.finalMedicalVerdict.isRecommended,
      });

      const savedAnalysis =
        await this.mealAnalysisRepository.save(mealAnalysis);

      return {
        success: true,
        analysisId: savedAnalysis.id,
      };
    } catch (error) {
      console.error('Error saving meal analysis:', error);
      throw new Error('Failed to save meal analysis');
    }
  }

  async getUserHistory(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
      occasion?: string;
      safetyStatus?: string;
      search?: string;
    },
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    // Construir condições de busca
    const where: FindOptionsWhere<MealAnalysis> = {
      user: {
        id: userId,
      },
    };

    if (options?.startDate && options?.endDate) {
      where.mealTimestamp = Between(options.startDate, options.endDate);
    } else if (options?.startDate) {
      where.mealTimestamp = Between(options.startDate, new Date());
    }

    if (options?.occasion) {
      where.occasion = options.occasion;
    }

    if (options?.safetyStatus) {
      where.safetyStatus = options.safetyStatus;
    }

    if (options?.search) {
      where.processedData = ILike(`%${options.search}%`) as any;
    }

    const [data, total] = await this.mealAnalysisRepository.findAndCount({
      where,
      order: { mealTimestamp: 'DESC' },
      skip,
      take: limit,
      select: [
        'id',
        'occasion',
        'mealTimestamp',
        'totalCalories',
        'totalNetCarbs',
        'safetyStatus',
        'isRecommended',
        'isFavorite',
        'createdAt',
      ],
    });

    return {
      data: data.map((analysis) => ({
        id: analysis.id,
        occasion: analysis.occasion,
        date: analysis.mealTimestamp,
        calories: analysis.totalCalories,
        netCarbs: analysis.totalNetCarbs,
        safetyStatus: analysis.safetyStatus,
        isRecommended: analysis.isRecommended,
        isFavorite: analysis.isFavorite,
        createdAt: analysis.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

async getDailySummary(userId: string, date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    
    // Início do dia
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Fim do dia
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await this.mealAnalysisRepository.find({
      where: {
        user: { id: userId },
        mealTimestamp: Between(startOfDay, endOfDay),
      },
      order: { mealTimestamp: 'ASC' },
    });

    // Calcular totais
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalNetCarbs = 0;
    let totalFiber = 0;
    let totalProtein = 0;
    let totalFat = 0;
    
    const mealsByOccasion: { [key: string]: any[] } = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    meals.forEach(meal => {
      totalCalories += Number(meal.totalCalories) || 0;
      totalCarbs += Number(meal.totalCarbs) || 0;
      totalNetCarbs += Number(meal.totalNetCarbs) || 0;
      totalFiber += Number(meal.totalFiber) || 0;
      totalProtein += Number(meal.totalProtein) || 0;
      totalFat += Number(meal.totalFat) || 0;

      if (mealsByOccasion[meal.occasion]) {
        mealsByOccasion[meal.occasion].push({
          id: meal.id,
          occasion: meal.occasion,
          timestamp: meal.mealTimestamp,
          totalCalories: meal.totalCalories,
          totalNetCarbs: meal.totalNetCarbs,
          safetyStatus: meal.safetyStatus,
          isRecommended: meal.isRecommended,
          isFavorite: meal.isFavorite,
          foods: meal.processedData?.identifiedFoods?.items || [],
        });
      }
    });

    // Calcular status geral do dia
    const redMeals = meals.filter(m => m.safetyStatus === 'RED').length;
    const yellowMeals = meals.filter(m => m.safetyStatus === 'YELLOW').length;
    const greenMeals = meals.filter(m => m.safetyStatus === 'GREEN').length;
    
    let overallStatus = 'GREEN';
    if (redMeals > 0) {
      overallStatus = 'RED';
    } else if (yellowMeals > 0) {
      overallStatus = 'YELLOW';
    }

    // Calcular porcentagens (valores recomendados padrão)
    const caloriesPercentage = totalCalories > 0 ? 
      Math.min((totalCalories / 2000) * 100, 100) : 0;
    
    const carbsPercentage = totalNetCarbs > 0 ? 
      Math.min((totalNetCarbs / 120) * 100, 100) : 0;

    return {
      date: targetDate.toISOString().split('T')[0],
      totals: {
        calories: totalCalories,
        carbs: totalCarbs,
        netCarbs: totalNetCarbs,
        fiber: totalFiber,
        protein: totalProtein,
        fat: totalFat,
      },
      percentages: {
        calories: caloriesPercentage,
        carbs: carbsPercentage,
      },
      status: {
        overall: overallStatus,
        red: redMeals,
        yellow: yellowMeals,
        green: greenMeals,
        total: meals.length,
      },
      mealsByOccasion,
      insights: this.generateDailyInsights(meals),
    };
  }

  private generateDailyInsights(meals: MealAnalysis[]) {
    const insights = [];
    
    if (meals.length === 0) {
      return ["Nenhuma refeição registrada hoje. Adicione sua primeira refeição para começar o acompanhamento."];
    }

    // Verificar refeições problemáticas
    const problematicMeals = meals.filter(m => m.safetyStatus === 'RED');
    if (problematicMeals.length > 0) {
      insights.push(`Atenção: ${problematicMeals.length} refeição(ões) com impacto glicêmico elevado hoje.`);
    }

    // Verificar distribuição de refeições
    const breakfastCount = meals.filter(m => m.occasion === 'breakfast').length;
    const lunchCount = meals.filter(m => m.occasion === 'lunch').length;
    const dinnerCount = meals.filter(m => m.occasion === 'dinner').length;
    
    if (breakfastCount === 0) {
      insights.push("Você não registrou café da manhã hoje. Não pule esta refeição importante!");
    }
    
    if (dinnerCount === 0 && new Date().getHours() >= 18) {
      insights.push("Ainda não há registro de jantar. Lembre-se de fazer uma refeição leve à noite.");
    }

    // Verificar proporção de fibras
    const totalFiber = meals.reduce((sum, m) => sum + Number(m.totalFiber), 0);
    if (totalFiber < 25) {
      insights.push("Consumo de fibras abaixo do recomendado (25g/dia). Considere adicionar mais vegetais.");
    }

    return insights;
  }
  
  async getAnalysisDetail(analysisId: string, userId: string) {
    const analysis = await this.mealAnalysisRepository.findOne({
      where: {
        id: analysisId,
        user: {
          id: userId,
        },
      },
    });

    if (!analysis) {
      throw new Error('Analysis not found or access denied');
    }

    return {
      id: analysis.id,
      occasion: analysis.occasion,
      timestamp: analysis.mealTimestamp,
      metrics: {
        totalCalories: analysis.totalCalories,
        totalCarbs: analysis.totalCarbs,
        totalNetCarbs: analysis.totalNetCarbs,
        totalFiber: analysis.totalFiber,
        totalProtein: analysis.totalProtein,
        totalFat: analysis.totalFat,
      },
      safetyStatus: analysis.safetyStatus,
      diabeticSuitability: analysis.diabeticSuitability,
      isRecommended: analysis.isRecommended,
      processedData: analysis.processedData,
      aiAnalysis: analysis.aiAnalysis,
      userNotes: analysis.userNotes,
      glucoseData: {
        before: analysis.bloodGlucoseBefore,
        after: analysis.bloodGlucoseAfter,
        response: analysis.glucoseResponse,
      },
      isFavorite: analysis.isFavorite,
      createdAt: analysis.createdAt,
      updatedAt: analysis.updatedAt,
    };
  }

  async updateWithGlucoseData(
    analysisId: string,
    userId: string,
    glucoseData: {
      bloodGlucoseBefore?: number;
      bloodGlucoseAfter?: number;
      glucoseResponse?: string;
      userNotes?: string;
    },
  ) {
    const analysis = await this.mealAnalysisRepository.findOne({
      where: {
        id: analysisId,
        user: {
          id: userId,
        },
      },
    });

    if (!analysis) {
      throw new Error('Analysis not found or access denied');
    }

    Object.assign(analysis, glucoseData);
    return await this.mealAnalysisRepository.save(analysis);
  }

  async toggleFavorite(analysisId: string, userId: string) {
    const analysis = await this.mealAnalysisRepository.findOne({
      where: {
        id: analysisId,
        user: {
          id: userId,
        },
      },
    });

    if (!analysis) {
      throw new Error('Analysis not found or access denied');
    }

    analysis.isFavorite = !analysis.isFavorite;
    return await this.mealAnalysisRepository.save(analysis);
  }

  async deleteAnalysis(analysisId: string, userId: string) {
    const result = await this.mealAnalysisRepository.delete({
      id: analysisId,
      user: {
        id: userId,
      },
    });

    if (result.affected === 0) {
      throw new Error('Analysis not found or access denied');
    }
  }

  async getStatistics(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const queryBuilder = this.mealAnalysisRepository
      .createQueryBuilder('meal')
      .select([
        'DATE(meal.mealTimestamp) as date',
        'COUNT(*) as totalMeals',
        'AVG(meal.totalCalories) as avgCalories',
        'AVG(meal.totalNetCarbs) as avgNetCarbs',
        'SUM(CASE WHEN meal.safetyStatus = "GREEN" THEN 1 ELSE 0 END) as greenMeals',
        'SUM(CASE WHEN meal.safetyStatus = "RED" THEN 1 ELSE 0 END) as redMeals',
        'meal.occasion as occasion',
      ])
      .where('meal.userId = :userId', { userId })
      .andWhere('meal.mealTimestamp >= :startDate', { startDate })
      .groupBy('DATE(meal.mealTimestamp), meal.occasion')
      .orderBy('date', 'DESC');

    return await queryBuilder.getRawMany();
  }

  async getUserFoodPreferences(userId: string) {
    const analyses = await this.mealAnalysisRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      select: ['processedData'],
    });

    const foodCounts = new Map<string, number>();
    const safeFoods = new Set<string>();
    const riskyFoods = new Set<string>();

    analyses.forEach((analysis) => {
      const foods = analysis.processedData?.identifiedFoods || [];
      const isSafe = analysis.safetyStatus === 'GREEN';

      foods.forEach((food: any) => {
        const foodName = food.name;
        foodCounts.set(foodName, (foodCounts.get(foodName) || 0) + 1);

        if (isSafe) {
          safeFoods.add(foodName);
        } else {
          riskyFoods.add(foodName);
        }
      });
    });

    return {
      mostCommonFoods: Array.from(foodCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([food, count]) => ({ food, count })),
      safeFoods: Array.from(safeFoods),
      riskyFoods: Array.from(riskyFoods),
      totalAnalyses: analyses.length,
    };
  }
}
