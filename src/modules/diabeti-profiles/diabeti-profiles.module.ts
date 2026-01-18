import { Module } from '@nestjs/common';
import { DiabeteProfilesService } from './diabeti-profiles.service';
import { DiabeteProfilesController } from './diabeti-profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiabeteProfiles } from '../../database/entities/diabeti-profiles/diabeti_profile.entity';
import { ClinicalProfilesService } from '@modules/clinical-profiles/clinical-profiles.service';
import { AllergiesService } from '@modules/allergies/allergies.service';
import { UsersService } from '@modules/users/users.service';
import { EmailService } from 'shared/email/email.service';
import { AssociatedConditionsService } from '@modules/associated-conditions/associated-conditions.service';
@Module({
  imports: [TypeOrmModule.forFeature([DiabeteProfiles])],
  controllers: [DiabeteProfilesController],
  providers: [
    DiabeteProfilesService,
    ClinicalProfilesService,
    AllergiesService,
    UsersService,
    EmailService,
    AssociatedConditionsService,
  ],

  exports: [
    DiabeteProfilesService,
    ClinicalProfilesService,
    AllergiesService,
    UsersService,
    EmailService,
    AssociatedConditionsService,
  ],
})
export class DiabeteProfilesModule {}
