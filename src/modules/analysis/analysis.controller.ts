// analysis/analysis.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
  HttpStatus,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalysisService } from './analysis.service';
import { Request } from 'express';
import { AuthGuard } from 'shared/auth/auth.guard';
import { HttpService } from '@nestjs/axios';

@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly analysisService: AnalysisService,
    private readonly httpService: HttpService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('analyze')
  @UseInterceptors(FileInterceptor('image'))
  async analyze(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.analysisService.analyze(request, file.buffer);
  }

  // @Post('recognize')
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     limits: {
  //       fileSize: 10 * 1024 * 1024, // 10MB limit
  //     },
  //     fileFilter: (req, file, callback) => {
  //       // Aceitar apenas imagens
  //       if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
  //         return callback(new Error('Only image files are allowed!'), false);
  //       }
  //       callback(null, true);
  //     },
  //   }),
  // )
  // async recognizeFood(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new BadRequestException('Image file is required');
  //   }

  //   // Validar tamanho do arquivo
  //   if (file.size > 10 * 1024 * 1024) {
  //     throw new BadRequestException('File size exceeds 10MB limit');
  //   }

  //   try {
  //     const result = await this.analysisService.recognizeFood(
  //       file.buffer,
  //       file.originalname,
  //     );
  //     return {
  //       success: true,
  //       status: HttpStatus.OK,
  //       data: result,
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         success: false,
  //         message: `Recognition failed: ${error.message}`,
  //         error: error.response?.data || error.message,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
}
