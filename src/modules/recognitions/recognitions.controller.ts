import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RecognitionService } from './recognitions.service';
import { CreateRecognitionDto } from './dtos/create-recognitions.dto';
import { UpdateRecognitionDto } from './dtos/update-recognitions.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('recognitions')
export class RecognitionController {
  constructor(private readonly recognitionService: RecognitionService) {}

  //all users recognitions
  @Get('all')
  async findAll(@Req() request: Request) {
    return await this.recognitionService.findAll(request);
  }

  @UseGuards(AuthGuard)
  @Get('recognition')
  async findByPk(@Req() request: Request) {
    return await this.recognitionService.findByPk(request);
  }

  @Post('create/recognition')
  create(
    @Param() request: Request,
    @Body() createRecognitionDto: CreateRecognitionDto,
  ) {
    return this.recognitionService.create(request, createRecognitionDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/recognition')
  async updateOne(
    @Param() id: string,
    @Req() request: Request,
    @Body() updateRecognitionDto: UpdateRecognitionDto,
  ) {
    return await this.recognitionService.updateOne(
      id,
      request,
      updateRecognitionDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/recognition/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.recognitionService.deleteOne(id, request);
  }
}
