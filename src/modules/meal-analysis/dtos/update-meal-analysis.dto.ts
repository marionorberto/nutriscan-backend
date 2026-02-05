// src/dto/SaveAnalysis.dto.ts
import {
  IsString,
  IsObject,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class UpdateAnalysisDto {
  @IsString()
  @IsOptional()
  occasion: string;

  @IsObject()
  @IsOptional()
  identifiedFoods: any;

  @IsObject()
  @IsOptional()
  mealNutrition: any;

  @IsObject()
  @IsOptional()
  insights: any;

  @IsObject()
  @IsOptional()
  analysis: any;

  @IsBoolean()
  @IsOptional()
  success: boolean;

  @IsDateString()
  @IsOptional()
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
