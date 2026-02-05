import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { VisionService } from '../vision/vision.service';
import { FoodDataService } from '@modules/food-data/services/food-data.service';
import { DiabeteProfilesService } from '@modules/diabeti-profiles/diabeti-profiles.service';
import { AIService } from '@modules/ai/services/ai.service';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AnalysisService {
  // private readonly logger = new Logger(LogmealService.name);
  private readonly apiKey: string = 'b1d8f62ef1bda2a36f3cf205fa277cca0ea91a77';
  private readonly baseUrl = 'https://api.logmeal.com/v2/';
  private readonly API_URL =
    'https://api.logmeal.es/v2/image/segmentation/complete';
  // private readonly API_TOKEN = 'b1d8f62ef1bda2a36f3cf205fa277cca0ea91a77';
  constructor(
    private readonly userService: UsersService,
    private readonly visionService: VisionService,
    private readonly foodDataService: FoodDataService,
    private readonly aiService: AIService,
    private readonly clinicalService: DiabeteProfilesService,
    private readonly httpService: HttpService,
  ) {}

  async analyze(request: Request, image: Buffer) {
    try {
      //check whether user is authenticated:
      const { userId } = request['user'];

      // console.time('TempoTotalAnalyze'); // Inicia o cronômetro global

      const [profileUserProfileInfo, visionResult] = await Promise.all([
        this.clinicalService.gatherProfileData(userId),
        this.visionService.analyze(image),
      ]);

      // console.time('GCP-Vision');
      //call to GCP api
      // const visionResult = await this.visionService.analyze(image);
      // console.timeEnd('GCP-Vision');

      // console.time('GPT-Limpeza');
      // clean data using chatgpt api
      const foodImageCleanedData =
        await this.aiService.imageFromGCPDataCleaning(visionResult);
      // console.timeEnd('GPT-Limpeza');

      // console.time('foodDATA');
      // call to foodData api
      const foodDataNutritions =
        await this.foodDataService.getNutritionBatch(foodImageCleanedData);
      // console.timeEnd('FOODdata');

      // console.timeEnd('TempoTotalAnalyze'); // Finaliza o global
      // clean data
      // const foodInfoNutritiosCleanedData =
      //   await this.aiService.infoFromFoodDataApiCleaning(foodDataNutritions);

      // return foodDataNutritions;

      // get profile data to function on profileService
      // const profileUserProfileInfo =
      // await this.clinicalService.gatherProfileData(userId);

      // prepare data to frontend
      const preparetedDataToFrontend =
        await this.aiService.prepareDataToFrontend(
          profileUserProfileInfo,
          foodDataNutritions,
          // foodInfoNutritiosCleanedData,
        );

      console.log(preparetedDataToFrontend);

      // response to frontend
      return {
        statusCode: 200,
        data: preparetedDataToFrontend,
      };
    } catch (error) {
      console.log('scan error ->', error.message);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message:
            'Não foi possível atender essa requisição. Tente novamente mais tarde!',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
