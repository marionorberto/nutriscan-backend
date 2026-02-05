export interface DiabeticFoodItem {
  id: number;
  name: string;
  confidence: string;
  probability: number;
  estimatedServing: number;

  // Informações relevantes para diabéticos
  diabeticRelevantInfo: {
    carbohydrates: number; // Carboidratos totais (g)
    fiber: number; // Fibras (g)
    sugars: number; // Açúcares (g)
    glycemicLoad: number; // Carga glicêmica
    protein: number; // Proteína (g)
    fat: number; // Gordura total (g)
    saturatedFat: number; // Gordura saturada (g)
    sodium: number; // Sódio (mg)
    calories: number; // Calorias (kcal)

    // Cálculos úteis para diabéticos
    netCarbs: number; // Carboidratos líquidos = carboidratos - fibras
    fiberRatio: number; // % de fibras nos carboidratos
    energyDensity: number; // Calorias por 100g
  };

  // Resumo visual rápido (para UI)
  quickSummary: {
    carbLevel: 'low' | 'medium' | 'high'; // Nível de carboidratos
    fiberLevel: 'low' | 'medium' | 'high'; // Nível de fibras
    healthScore: number; // Score de 0-100
    isDiabeticFriendly: boolean; // Amigável para diabéticos?
  };

  // Recomendações específicas para diabéticos
  recommendations?: {
    servingSuggestion: string; // Sugestão de porção
    bestCombination: string; // Combinar com...
    warning?: string; // Alerta se houver
  };
}

export interface DiabeticMealAnalysis {
  occasion: string;
  timestamp: string;
  success: boolean;

  // Alimentos identificados (resumidos)
  identifiedFoods: DiabeticFoodItem[];

  // Análise nutricional da refeição completa
  mealNutrition: {
    totalCalories: number;
    totalCarbs: number;
    totalNetCarbs: number;
    totalFiber: number;
    totalSugars: number;
    totalProtein: number;
    totalFat: number;

    // Porcentagens diárias recomendadas (baseado em dieta diabética)
    dailyPercentages: {
      carbs: number; // % da meta diária de carboidratos
      fiber: number; // % da meta diária de fibras
      protein: number; // % da meta diária de proteína
    };

    // Índices importantes para diabéticos
    glycemicLoad: number;
    fiberToCarbRatio: number; // Proporção fibras/carboidratos

    // Classificação da refeição
    mealType: 'low-carb' | 'balanced' | 'high-carb';
    diabeticSuitability: 'excellent' | 'good' | 'moderate' | 'poor';
  };

  // Insights para o usuário
  insights: {
    carbSources: Array<{
      food: string;
      carbs: number;
    }>;
    highFiberFoods: string[];
    suggestions: string[];
    warnings?: string[];
  };

  // Dados originais resumidos (se necessário para referência)
  originalData?: {
    topFoods: Array<{
      name: string;
      probability: number;
    }>;
    nutriScore?: string;
  };
}

export function refineFoodDataForDiabeticApp(
  apiResponse: any,
): DiabeticMealAnalysis {
  try {
    const occasion = apiResponse.occasion || 'unknown';
    const foodItems = Array.isArray(apiResponse.foodItems)
      ? apiResponse.foodItems
      : [];
    const nutritionalSummary = apiResponse.nutritionalSummary || {};

    // 1. Processar cada alimento com foco em diabetes
    const identifiedFoods = foodItems.map((item: any) => {
      const nutrition = item.nutrition?.nutrients || {};
      const serving = item.estimatedServing || 100;

      // Extrair valores nutricionais
      const carbs = nutrition.CHOCDF?.quantity || 0;
      const fiber = nutrition.FIBTG?.quantity || 0;
      const sugars = nutrition.SUGAR?.quantity || 0;
      const glycemicLoad = nutrition.GL?.quantity || 0;
      const protein = nutrition.PROCNT?.quantity || 0;
      const fat = nutrition.FAT?.quantity || 0;
      const saturatedFat = nutrition.FASAT?.quantity || 0;
      const sodium = nutrition.NA?.quantity || 0;
      const calories = item.nutrition?.calories || 0;

      // Cálculos para diabéticos
      const netCarbs = Math.max(0, carbs - fiber);
      const fiberRatio = carbs > 0 ? (fiber / carbs) * 100 : 0;
      const energyDensity = (calories / serving) * 100;

      // Determinar níveis
      const carbLevel = getCarbLevel(carbs, serving);
      const fiberLevel = getFiberLevel(fiber, serving);
      const healthScore = calculateHealthScore(item);
      const isDiabeticFriendly = isFoodDiabeticFriendly(carbs, fiber, sugars);

      return {
        id: item.id || 0,
        name: item.name || 'Unknown',
        confidence: item.confidence || 'Low',
        probability: item.probability || 0,
        estimatedServing: serving,

        diabeticRelevantInfo: {
          carbohydrates: parseFloat(carbs.toFixed(1)),
          fiber: parseFloat(fiber.toFixed(1)),
          sugars: parseFloat(sugars.toFixed(1)),
          glycemicLoad: parseFloat(glycemicLoad.toFixed(1)),
          protein: parseFloat(protein.toFixed(1)),
          fat: parseFloat(fat.toFixed(1)),
          saturatedFat: parseFloat(saturatedFat.toFixed(1)),
          sodium: parseFloat(sodium.toFixed(0)),
          calories: parseFloat(calories.toFixed(0)),
          netCarbs: parseFloat(netCarbs.toFixed(1)),
          fiberRatio: parseFloat(fiberRatio.toFixed(1)),
          energyDensity: parseFloat(energyDensity.toFixed(0)),
        },

        quickSummary: {
          carbLevel,
          fiberLevel,
          healthScore,
          isDiabeticFriendly,
        },

        recommendations: generateFoodRecommendations(
          item.name,
          carbs,
          fiber,
          sugars,
        ),
      };
    });

    // 2. Análise da refeição completa
    const totalCarbs = identifiedFoods.reduce(
      (sum, food) => sum + food.diabeticRelevantInfo.carbohydrates,
      0,
    );
    const totalFiber = identifiedFoods.reduce(
      (sum, food) => sum + food.diabeticRelevantInfo.fiber,
      0,
    );
    const totalNetCarbs = identifiedFoods.reduce(
      (sum, food) => sum + food.diabeticRelevantInfo.netCarbs,
      0,
    );
    const totalSugars = identifiedFoods.reduce(
      (sum, food) => sum + food.diabeticRelevantInfo.sugars,
      0,
    );
    const totalProtein = identifiedFoods.reduce(
      (sum, food) => sum + food.diabeticRelevantInfo.protein,
      0,
    );
    const totalFat = identifiedFoods.reduce(
      (sum, food) => sum + food.diabeticRelevantInfo.fat,
      0,
    );
    const totalCalories = identifiedFoods.reduce(
      (sum, food) => sum + food.diabeticRelevantInfo.calories,
      0,
    );

    // Meta diária para diabéticos (ajustável)
    const DAILY_CARBS_GOAL = 130; // gramas (recomendação geral)
    const DAILY_FIBER_GOAL = 25; // gramas
    const DAILY_PROTEIN_GOAL = 50; // gramas

    // 3. Gerar insights
    const insights = generateDiabeticInsights(identifiedFoods);

    return {
      occasion,
      timestamp: apiResponse.timestamp || new Date().toISOString(),
      success: apiResponse.success !== false,

      identifiedFoods,

      mealNutrition: {
        totalCalories: parseFloat(totalCalories.toFixed(0)),
        totalCarbs: parseFloat(totalCarbs.toFixed(1)),
        totalNetCarbs: parseFloat(totalNetCarbs.toFixed(1)),
        totalFiber: parseFloat(totalFiber.toFixed(1)),
        totalSugars: parseFloat(totalSugars.toFixed(1)),
        totalProtein: parseFloat(totalProtein.toFixed(1)),
        totalFat: parseFloat(totalFat.toFixed(1)),

        dailyPercentages: {
          carbs: parseFloat(((totalCarbs / DAILY_CARBS_GOAL) * 100).toFixed(1)),
          fiber: parseFloat(((totalFiber / DAILY_FIBER_GOAL) * 100).toFixed(1)),
          protein: parseFloat(
            ((totalProtein / DAILY_PROTEIN_GOAL) * 100).toFixed(1),
          ),
        },

        glycemicLoad: identifiedFoods.reduce(
          (sum, food) => sum + food.diabeticRelevantInfo.glycemicLoad,
          0,
        ),
        fiberToCarbRatio: totalCarbs > 0 ? (totalFiber / totalCarbs) * 100 : 0,

        mealType: classifyMealType(totalCarbs, totalFiber),
        diabeticSuitability: assessDiabeticSuitability(
          totalCarbs,
          totalNetCarbs,
          totalFiber,
        ),
      },

      insights,

      originalData: {
        topFoods: (apiResponse.topFoods || []).slice(0, 3).map((food: any) => ({
          name: food.name,
          probability: food.probability,
        })),
        nutriScore: nutritionalSummary.imageNutriScore?.nutri_score_category,
      },
    };
  } catch (error) {
    console.error('Error refining food data for diabetic app:', error);

    return {
      occasion: 'unknown',
      timestamp: new Date().toISOString(),
      success: false,
      identifiedFoods: [],
      mealNutrition: {
        totalCalories: 0,
        totalCarbs: 0,
        totalNetCarbs: 0,
        totalFiber: 0,
        totalSugars: 0,
        totalProtein: 0,
        totalFat: 0,
        dailyPercentages: { carbs: 0, fiber: 0, protein: 0 },
        glycemicLoad: 0,
        fiberToCarbRatio: 0,
        mealType: 'balanced',
        diabeticSuitability: 'moderate',
      },
      insights: {
        carbSources: [],
        highFiberFoods: [],
        suggestions: ['Não foi possível analisar a refeição'],
      },
    };
  }
}

// Funções auxiliares
function getCarbLevel(
  carbs: number,
  serving: number,
): 'low' | 'medium' | 'high' {
  const carbsPer100g = (carbs / serving) * 100;
  if (carbsPer100g < 5) return 'low';
  if (carbsPer100g < 20) return 'medium';
  return 'high';
}

function getFiberLevel(
  fiber: number,
  serving: number,
): 'low' | 'medium' | 'high' {
  const fiberPer100g = (fiber / serving) * 100;
  if (fiberPer100g < 3) return 'low';
  if (fiberPer100g < 6) return 'medium';
  return 'high';
}

function isFoodDiabeticFriendly(
  carbs: number,
  fiber: number,
  sugars: number,
): boolean {
  const netCarbs = carbs - fiber;
  return netCarbs < 15 && sugars < 5;
}

function calculateHealthScore(item: any): number {
  // Simples cálculo baseado em nutriScore
  const nutriScore = item.nutriScore?.nutri_score_standardized || 50;
  return Math.min(100, Math.max(0, nutriScore));
}

function generateFoodRecommendations(
  name: string,
  carbs: number,
  fiber: number,
  sugars: number,
): {
  servingSuggestion: string;
  bestCombination: string;
  warning?: string;
} {
  const netCarbs = carbs - fiber;

  let servingSuggestion = 'Porção moderada';
  let bestCombination = 'Proteína magra';
  let warning;

  if (sugars > 10) {
    warning = 'Alto teor de açúcar';
    servingSuggestion = 'Porção reduzida';
  }

  if (netCarbs > 20) {
    bestCombination = 'Combine com vegetais fibrosos';
  }

  if (fiber > 5) {
    bestCombination = 'Boa fonte de fibras';
  }

  return { servingSuggestion, bestCombination, warning };
}

function generateDiabeticInsights(foods: DiabeticFoodItem[]) {
  // Fontes de carboidratos
  const carbSources = foods
    .filter((food) => food.diabeticRelevantInfo.carbohydrates > 5)
    .map((food) => ({
      food: food.name,
      carbs: food.diabeticRelevantInfo.carbohydrates,
    }))
    .sort((a, b) => b.carbs - a.carbs);

  // Alimentos ricos em fibras
  const highFiberFoods = foods
    .filter((food) => food.diabeticRelevantInfo.fiber > 3)
    .map((food) => food.name);

  // Sugestões baseadas na análise
  const suggestions: string[] = [];
  const totalNetCarbs = foods.reduce(
    (sum, food) => sum + food.diabeticRelevantInfo.netCarbs,
    0,
  );
  const totalFiber = foods.reduce(
    (sum, food) => sum + food.diabeticRelevantInfo.fiber,
    0,
  );

  if (totalNetCarbs > 30) {
    suggestions.push(
      'Refeição com carboidratos moderados. Monitorar glicemia pós-refeição.',
    );
  }

  if (totalFiber > 8) {
    suggestions.push('Excelente fonte de fibras! Ajuda no controle glicêmico.');
  }

  if (foods.some((food) => food.diabeticRelevantInfo.sugars > 10)) {
    suggestions.push(
      'Contém alimentos com açúcar elevado. Consumir com moderação.',
    );
  }

  return { carbSources, highFiberFoods, suggestions };
}

function classifyMealType(
  totalCarbs: number,
  totalFiber: number,
): 'low-carb' | 'balanced' | 'high-carb' {
  const netCarbs = totalCarbs - totalFiber;
  if (netCarbs < 20) return 'low-carb';
  if (netCarbs < 40) return 'balanced';
  return 'high-carb';
}

function assessDiabeticSuitability(
  totalCarbs: number,
  totalNetCarbs: number,
  totalFiber: number,
): 'excellent' | 'good' | 'moderate' | 'poor' {
  const fiberRatio = totalCarbs > 0 ? (totalFiber / totalCarbs) * 100 : 0;

  if (totalNetCarbs < 20 && fiberRatio > 20) return 'excellent';
  if (totalNetCarbs < 30 && fiberRatio > 15) return 'good';
  if (totalNetCarbs < 40 && fiberRatio > 10) return 'moderate';
  return 'poor';
}
