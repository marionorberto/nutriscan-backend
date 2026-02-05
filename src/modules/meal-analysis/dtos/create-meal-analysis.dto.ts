// src/dto/SaveAnalysis.dto.ts
import { IsString, IsObject, IsBoolean, IsDateString } from 'class-validator';

export class CreateAnalysisDto {
  @IsString()
  occasion: string;

  @IsObject()
  identifiedFoods: any;

  @IsObject()
  mealNutrition: any;

  @IsObject()
  insights: any;

  @IsObject()
  analysis: any;

  @IsBoolean()
  success: boolean;

  @IsDateString()
  timestamp: string;
}

// export class UpdateGlucoseDto {
//   @IsNumber()
//   @IsOptional()
//   bloodGlucoseBefore?: number;

//   @IsNumber()
//   @IsOptional()
//   bloodGlucoseAfter?: number;

//   @IsString()
//   @IsOptional()
//   glucoseResponse?: string;

//   @IsString()
//   @IsOptional()
//   userNotes?: string;
// }
