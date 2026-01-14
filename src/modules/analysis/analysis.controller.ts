// analysis/analysis.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalysisService } from './analysis.service';
import { Request } from 'express';
import { AuthGuard } from 'shared/auth/auth.guard';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @UseGuards(AuthGuard)
  @Post('analyze')
  @UseInterceptors(FileInterceptor('image'))
  async analyze(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.analysisService.analyze(request, file.buffer);
  }
}
