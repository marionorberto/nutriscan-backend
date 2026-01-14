// analysis/analysis.module.ts
import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

import { VisionModule } from '../vision/vision.module';
import { FoodDataModule } from '../food-data/food-data.module';
import { AIModule } from '../ai/ai.module';
import { DiabeteProfilesModule } from '@modules/diabeti-profiles/diabeti-profiles.module';
import { UsersService } from '@modules/users/users.service';
import { EmailService } from 'shared/email/email.service';

@Module({
  imports: [VisionModule, FoodDataModule, DiabeteProfilesModule, AIModule],
  controllers: [AnalysisController],
  providers: [AnalysisService, UsersService, EmailService],
  exports: [UsersService, EmailService, UsersService, EmailService],
})
export class AnalysisModule {}
