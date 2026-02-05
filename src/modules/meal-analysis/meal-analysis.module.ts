// src/modules/MealAnalysis.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealAnalysisController } from './meal-analysis.controller';
import { MealAnalysisService } from './meal-analysis.service';
import { MealAnalysis } from '@database/entities/meal-analyses/meal-analysis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealAnalysis])],
  controllers: [MealAnalysisController],
  providers: [MealAnalysisService],
  exports: [MealAnalysisService],
})
export class MealAnalysisModule {}
