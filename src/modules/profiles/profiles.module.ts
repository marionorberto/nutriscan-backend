import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { profilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from 'shared/email/email.service';
import { Profiles } from '@database/entities/profile/profile.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Profiles])],
  controllers: [profilesController],
  providers: [ProfilesService, EmailService],
  exports: [ProfilesService, EmailService],
})
export class ProfilesModule {}
