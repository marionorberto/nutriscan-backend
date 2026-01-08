import { Module } from '@nestjs/common';
import { ClinicalProfilesService } from './clinical-profiles.service';
import { ClinicalProfileController } from './clinical-profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalProfiles } from '../../database/entities/clinical-profiles/clinical-profile.entity';
import { UsersService } from '@modules/users/users.service';
import { EmailService } from 'shared/email/email.service';
@Module({
  imports: [TypeOrmModule.forFeature([ClinicalProfiles])],
  controllers: [ClinicalProfileController],
  providers: [ClinicalProfilesService, UsersService, EmailService],
  exports: [ClinicalProfilesService, UsersService, EmailService],
})
export class ClinicalProfilesModule {}
