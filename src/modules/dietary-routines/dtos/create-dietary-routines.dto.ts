import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnumCulturalPreference } from '@modules/dietary-routines/interfaces/interfaces';

export class CreateDietaryRoutineDto {
  @IsNumber({}, { message: '*mealsPerDay deve ser um número' })
  @Type(() => Number)
  @IsNotEmpty({ message: '*mealsPerDay não pode estar vazio' })
  mealsPerDay: number;

  @IsArray({ message: '*favoriteFoods deve ser uma lista' })
  @IsNotEmpty({ message: '*favoriteFoods não pode estar vazio' })
  @IsString({
    message: '*favoriteFoods deve conter apenas textos',
  })
  favoriteFoods: string;

  @IsNotEmpty({ message: '*foodsToAvoid não pode estar vazio' })
  @IsString({
    message: '*foodsToAvoid deve conter apenas textos',
  })
  foodsToAvoid: string;

  @IsOptional()
  @IsString({
    each: true,
    message: '*mealSchedules deve conter apenas textos',
  })
  mealSchedules?: string;

  @IsEnum(EnumCulturalPreference, {
    message: '*culturalPreferences deve ser um valor válido',
  })
  @IsNotEmpty({ message: '*culturalPreferences não pode estar vazio' })
  culturalPreferences: EnumCulturalPreference;

  @IsOptional()
  @IsString({
    each: true,
    message: '*religiousRestrictions deve conter apenas textos',
  })
  religiousRestrictions?: string;
}
