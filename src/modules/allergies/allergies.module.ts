import { Module } from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { AllergiesController } from './allergies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allergies } from '../../database/entities/allergies/allergy.entity';
import { UsersService } from '@modules/users/users.service';
import { EmailService } from 'shared/email/email.service';
@Module({
  imports: [TypeOrmModule.forFeature([Allergies])],
  controllers: [AllergiesController],
  providers: [AllergiesService, UsersService, EmailService],
  exports: [AllergiesService, UsersService, EmailService],
})
export class AllergiesModule {}
