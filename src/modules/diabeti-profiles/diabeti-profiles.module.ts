import { Module } from '@nestjs/common';
import { DiabeteProfilesService } from './diabeti-profiles.service';
import { DiabeteProfilesController } from './diabeti-profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiabeteProfiles } from '../../database/entities/diabeti-profiles/diabeti_profile.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DiabeteProfiles])],
  controllers: [DiabeteProfilesController],
  providers: [DiabeteProfilesService],
  exports: [DiabeteProfilesService],
})
export class DiabeteProfilesModule {}
