import { Module } from '@nestjs/common';
import { MedicationService } from './medications.service';
import { MedicationController } from './medications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medications } from '../../database/entities/medications/medication.entity';
import { UsersService } from '@modules/users/users.service';
import { EmailService } from 'shared/email/email.service';
@Module({
  imports: [TypeOrmModule.forFeature([Medications])],
  controllers: [MedicationController],
  providers: [MedicationService, UsersService, EmailService],
  exports: [MedicationService, UsersService, EmailService],
})
export class MedicationModule {}
