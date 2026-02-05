import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LogMealService } from './logmeal.service';
import { LogMealController } from './logmeal.controller';
import { ConfigModule } from '@nestjs/config';
import { NutritionAnalysisService } from './nutrition-analysis.service';
import { FoodAnalysisController } from './food-analysis.controller';
import { DiabeteProfilesService } from '@modules/diabeti-profiles/diabeti-profiles.service';
import { ClinicalProfilesService } from '@modules/clinical-profiles/clinical-profiles.service';
import { ProfilesService } from '@modules/profiles/profiles.service';
import { UsersService } from '@modules/users/users.service';
import { EmailService } from 'shared/email/email.service';
import { AllergiesService } from '@modules/allergies/allergies.service';
import { AssociatedConditionsService } from '@modules/associated-conditions/associated-conditions.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [LogMealController, FoodAnalysisController],
  providers: [
    LogMealService,
    NutritionAnalysisService,
    DiabeteProfilesService,
    ClinicalProfilesService,
    ProfilesService,
    UsersService,
    EmailService,
    AllergiesService,
    AssociatedConditionsService,
  ],
  exports: [
    LogMealService,
    NutritionAnalysisService,
    DiabeteProfilesService,
    ClinicalProfilesService,
    ProfilesService,
    UsersService,
    EmailService,
    AllergiesService,
    AssociatedConditionsService,
  ],
})
export class LogMealModule {}
