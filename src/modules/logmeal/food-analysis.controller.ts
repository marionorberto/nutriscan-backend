import { Controller, Logger } from '@nestjs/common';
import { LogMealService } from './logmeal.service';
import { NutritionAnalysisService } from './nutrition-analysis.service';

@Controller('food-analysis')
export class FoodAnalysisController {
  private readonly logger = new Logger(FoodAnalysisController.name);

  constructor(
    private readonly logMealService: LogMealService,
    private readonly nutritionAnalysisService: NutritionAnalysisService,
  ) {}
}
