import { Module } from '@nestjs/common';
import { MedicationScheduleService } from './medication-schedules.service';
import { MedicationScheduleController } from './medication-schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '@modules/users/users.service';
import { MedicationSchedule } from '@database/entities/medication-schedules/medication-schedules.entity';
@Module({
  imports: [TypeOrmModule.forFeature([MedicationSchedule])],
  controllers: [MedicationScheduleController],
  providers: [MedicationScheduleService, UsersService],
  exports: [MedicationScheduleService, UsersService],
})
export class MedicationModule {}
