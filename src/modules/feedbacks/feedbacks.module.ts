import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedbacks } from '../../database/entities/feedbacks/feedback.entity';
import { UsersService } from '@modules/users/users.service';
@Module({
  imports: [TypeOrmModule.forFeature([Feedbacks])],
  controllers: [FeedbacksController],
  providers: [FeedbacksService, UsersService],
  exports: [FeedbacksService, UsersService],
})
export class feedbacksModule {}
