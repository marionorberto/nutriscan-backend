import { Module } from '@nestjs/common';
import { ClinicalProfilesService } from './clinical-profiles.service';
import { UsersController } from './clinical-profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalProfiles } from '../../database/entities/clinical-profiles/clinical-profile.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ClinicalProfiles])],
  controllers: [UsersController],
  providers: [ClinicalProfilesService],
  exports: [ClinicalProfilesService],
})
export class ClinicalProfilesModule {}
