// analysis/analysis.service.ts
import { Injectable } from '@nestjs/common';
import { VisionService } from '../vision/vision.service';
import { FoodDataService } from '@modules/food-data/services/food-data.service';
import { DiabeteProfilesService } from '@modules/diabeti-profiles/diabeti-profiles.service';
import { AiAnalysisService } from '@modules/ai/services/ai-analysi.service';
import { AnalyzeImageDto } from './dto/analyse-image.dto';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly visionService: VisionService,
    private readonly foodDataService: FoodDataService,
    private readonly clinicalService: DiabeteProfilesService,
    private readonly aiService: AiAnalysisService,
  ) {}

  async analyze(image: Express.Multer.File, dto: AnalyzeImageDto ) {
  /** 1️⃣ Cloud Vision */
  // const labels = await this.visionService.analyzeImage(image);

  /** 2️⃣ Escolher alimento principal */
  // const mainFood = labels[0]; // simples para MVP

  /** 3️⃣ Buscar dados nutricionais */
  // const nutrition = await this.foodDataService.getNutrition(mainFood);

  /** 4️⃣ Avaliação clínica */
  // const clinicalResult = this.clinicalService.(
  // nutrition,
  // dto.patientProfile,
  // );

  /** 5️⃣ Análise com IA */
  // const aiAnalysis = await this.aiService.analyzeFood({
  // food: mainFood,
  // nutrition,
  // clinicalResult,
  // patientProfile: dto.patientProfile,
  // });

  /** 6️⃣ Resposta final */
    // return {
      // detectedFood: mainFood,
      // nutrition,
      // clinicalResult,
      // recommendations: aiAnalysis,
    // };
  }
}
