import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VisionService } from './vision.service';

@Controller('vision')
export class VisionController {
  constructor(private readonly visionService: VisionService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeImage(@UploadedFile() file: Express.Multer.File) {
    return this.visionService.analyzeFood(file.buffer);
  }

  @Post('analyze-food')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Arquivo deve ser uma imagem'), false);
        }
        cb(null, true);
      },
    }),
  )
  async analyze(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Imagem é obrigatória');
    }

    return this.visionService.analyzeImage(file.buffer);
  }
}
