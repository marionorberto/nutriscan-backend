import { Module } from '@nestjs/common';
import { DietaryRoutineService } from './dietary-routines.service';
import { DietaryRoutineController } from './dietary-routines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DietaryRoutines } from '../../database/entities/dietary-routines/dietary-routine.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DietaryRoutines])],
  controllers: [DietaryRoutineController],
  providers: [DietaryRoutineService],
  exports: [DietaryRoutineService],
})
export class DietaryRoutineModule {}
