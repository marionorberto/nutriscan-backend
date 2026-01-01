import { Module } from '@nestjs/common';
import { MedicationService } from './medications.service';
import { MedicationController } from './medications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medications } from '../../database/entities/medications/medication.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Medications])],
  controllers: [MedicationController],
  providers: [MedicationService],
  exports: [MedicationService],
})
export class MedicationModule {}
