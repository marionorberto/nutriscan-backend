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
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dtos/create-feebacks.dto';
import { UpdateFeedbackDto } from './dtos/update-feedbacks.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbackService: FeedbacksService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.feedbackService.findAll(request);
  }

  @UseGuards(AuthGuard)
  @Get('feedback')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param() id: string, @Req() request: Request) {
    return await this.feedbackService.findByPk(id, request);
  }

  @Post('create/feedback')
  create(
    @Param() request: Request,
    @Body() createfeedbackDto: CreateFeedbackDto,
  ) {
    return this.feedbackService.create(request, createfeedbackDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/feedback')
  async updateOne(
    @Param() id: string,
    @Req() request: Request,
    @Body() updateFeedbacksDto: UpdateFeedbackDto,
  ) {
    return await this.feedbackService.updateOne(
      id,
      request,
      updateFeedbacksDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/feedback/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.feedbackService.deleteOne(id, request);
  }
}
