// analysis/analysis.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalysisService } from './analysis.service';
import { AnalyzeImageDto } from './dto/analyse-image.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('food')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeFood(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: AnalyzeImageDto,
  ) {
    return this.analysisService.analyze(image, body);
  }
}
