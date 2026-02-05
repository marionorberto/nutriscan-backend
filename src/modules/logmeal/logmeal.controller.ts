import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LogMealService } from './logmeal.service';
import {
  ProcessedFoodResponse,
  ApiResponse,
  FoodAnalysisRequest,
} from './interfaces/logmeal.interface';
import * as fs from 'fs';
import { NutritionAnalysisService } from './nutrition-analysis.service';
import { DiabeteProfilesService } from '@modules/diabeti-profiles/diabeti-profiles.service';
import { Request } from 'express';
import { AuthGuard } from 'shared/auth/auth.guard';

@Controller('food-analysis')
export class LogMealController {
  private readonly logger = new Logger(LogMealController.name);

  constructor(
    private readonly logMealService: LogMealService,
    private readonly nutritionAnalysisService: NutritionAnalysisService,
    private readonly diabeteService: DiabeteProfilesService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('analyze-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `food-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async analyzeImage(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ApiResponse<any>> {
    try {
      if (!file) {
        throw new BadRequestException('No image file provided');
      }

      // Ler o arquivo como buffer
      const imageBuffer = fs.readFileSync(file.path);

      // // Processar a imagem
      const result = await this.logMealService.processFoodImage(
        imageBuffer,
        file.mimetype,
      );

      // // Remover arquivo temporário
      fs.unlinkSync(file.path);

      const final =
        await this.nutritionAnalysisService.analyzeFoodWithNutritionist(
          request,
          result,
        );

      return {
        success: true,
        data: final,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error('Error analyzing image:', error);

      // Limpar arquivo temporário se existir
      if (file?.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (e) {
          this.logger.warn(`Failed to delete temp file: ${e.message}`);
        }
      }

      return {
        success: false,
        error: error.message || 'Failed to analyze image',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('analyze-base64')
  async analyzeBase64(
    @Body() body: FoodAnalysisRequest,
  ): Promise<ApiResponse<ProcessedFoodResponse>> {
    try {
      const { image, mimeType = 'image/jpeg' } = body;

      if (!image) {
        throw new BadRequestException('Image is required');
      }

      this.logger.log('Processing base64 image');

      const result = await this.logMealService.processFoodImageBase64(
        image,
        mimeType,
      );

      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error('Error analyzing base64 image:', error);

      return {
        success: false,
        error: error.message || 'Failed to analyze image',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('test-connection')
  async testConnection(): Promise<
    ApiResponse<{ connected: boolean; message: string }>
  > {
    try {
      // Testar com uma imagem de exemplo pequena
      const testImage = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64',
      );

      await this.logMealService.recognizeFoodFromImage(testImage, 'image/png');

      return {
        success: true,
        data: {
          connected: true,
          message: 'Successfully connected to LogMeal API',
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Connection test failed: ${error.message}`,
        data: {
          connected: false,
          message: error.message,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }
}
