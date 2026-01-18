import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDietaryRoutineDto {
  @IsNumber({}, { message: '*mealsPerDay deve ser um número' })
  @Type(() => Number)
  @IsNotEmpty({ message: '*mealsPerDay não pode estar vazio' })
  mealsPerDay: number;

  @IsNotEmpty({ message: '*favoriteFoods não pode estar vazio' })
  @IsString({
    message: '*favoriteFoods deve conter apenas textos',
  })
  favoriteFoods: string;

  @IsNotEmpty({ message: '*foodsToAvoid não pode estar vazio' })
  @IsString({
    message: '*foodsToAvoid deve conter apenas textos',
  })
  @IsOptional()
  foodsToAvoid: string;

  @IsOptional()
  @IsString({
    each: true,
    message: '*mealSchedules deve conter apenas textos',
  })
  mealSchedules?: string;

  @IsNotEmpty({ message: '*culturalPreferences não pode estar vazio' })
  culturalPreferences: string;

  @IsOptional()
  @IsString({
    each: true,
    message: '*religiousRestrictions deve conter apenas textos',
  })
  religiousRestrictions?: string;

  @IsNotEmpty({ message: '*user não pode estar vazio' })
  userID: string;
}
