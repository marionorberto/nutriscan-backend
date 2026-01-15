// analysis/analysis.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { VisionService } from '../vision/vision.service';
import { FoodDataService } from '@modules/food-data/services/food-data.service';
import { DiabeteProfilesService } from '@modules/diabeti-profiles/diabeti-profiles.service';
import { AIService } from '@modules/ai/services/ai.service';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly userService: UsersService,
    private readonly visionService: VisionService,
    private readonly foodDataService: FoodDataService,
    private readonly aiService: AIService,
    private readonly clinicalService: DiabeteProfilesService,
  ) {}

  async analyze(request: Request, image: Buffer) {
    try {
      //check whether user is authenticated:
      const { userId } = request['user'];

      const userData = await this.userService.checkUserIsAuthenticated(userId);

      //call to GCP api
      const visionResult = await this.visionService.analyze(image);

      // clean data using chatgpt api
      const foodImageCleanedData =
        await this.aiService.imageFromGCPDataCleaning(visionResult);

      // call to foodData api
      const foodDataNutritions =
        await this.foodDataService.getNutritionBatch(foodImageCleanedData);

      // clean data
      // const foodInfoNutritiosCleanedData =
      //   await this.aiService.infoFromFoodDataApiCleaning(foodDataNutritions);

      // get profile data to function on profileService
      const profileUserProfileInfo =
        await this.clinicalService.gatherProfileData(userData.id);

      // prepare data to frontend
      const preparetedDataToFrontend =
        await this.aiService.prepareDataToFrontend(
          profileUserProfileInfo,
          foodDataNutritions,
          // foodInfoNutritiosCleanedData,
        );

      // response to frontend
      return {
        statusCode: 200,
        method: 'GET',
        message: 'Requisição atendida com sucesso!',
        path: request.url,
        timestamp: Date.now(),
        result: preparetedDataToFrontend,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message:
            'aqui !!Não foi possível atender essa requisição. Tente novamente mais tarde!',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
