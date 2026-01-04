import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { ReferencedImageService } from './reference-images.service';
import { UpdateReferencedImageDto } from './dtos/update-referenced-images.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'shared/file-upload/file-upload.service';
import { UploadPipe } from 'shared/file-upload/pipes/upload.pipe';

@Controller('reference-images')
export class ReferencedImageController {
  constructor(
    private readonly referencedImageService: ReferencedImageService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(request: Request) {
    return await this.referencedImageService.findAll(request);
  }

  @UseGuards(AuthGuard)
  @Get('refereced-image/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string, @Req() request: Request) {
    return await this.referencedImageService.findByPk(id, request);
  }

  @Post('create/refereced-image')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile(UploadPipe) file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return this.referencedImageService.create(file, request);
  }

  @UseGuards(AuthGuard)
  @Put('update/refereced-image')
  async updateOne(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() updateReferencedImageDto: UpdateReferencedImageDto,
  ) {
    return await this.referencedImageService.updateOne(
      id,
      request,
      updateReferencedImageDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/refereced-image/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.referencedImageService.deleteOne(id, request);
  }
}
