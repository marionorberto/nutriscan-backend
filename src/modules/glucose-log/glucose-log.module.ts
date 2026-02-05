// src/modules/Glucose.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlucoseController } from './glucose-log.controller';
import { GlucoseService } from './glucose-log.service';
import { DailyGlucoseSummary } from '@database/entities/daily-glucose-summaries/daily-glucose-summaries.entity';
import { GlucoseLog } from '@database/entities/glucose-control/glucose-control.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GlucoseLog, DailyGlucoseSummary])],
  controllers: [GlucoseController],
  providers: [GlucoseService],
  exports: [GlucoseService],
})
export class GlucoseModule {}
