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
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dtos/create-feebacks.dto';
import { UpdateFeedbackDto } from './dtos/update-feedbacks.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbackService: FeedbacksService) {}

  @Get('all')
  async findAll() {
    return await this.feedbackService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('feedback')
  async findByPk(@Req() request: Request) {
    return await this.feedbackService.findByPk(request);
  }

  @UseGuards(AuthGuard)
  @Post('create/feedback')
  create(
    @Req() request: Request,
    @Body() createfeedbackDto: CreateFeedbackDto,
  ) {
    return this.feedbackService.create(request, createfeedbackDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/feedback')
  async updateOne(
    @Req() request: Request,
    @Body() updateFeedbacksDto: UpdateFeedbackDto,
  ) {
    return await this.feedbackService.updateOne(request, updateFeedbacksDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/feedback/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.feedbackService.deleteOne(id, request);
  }
}
