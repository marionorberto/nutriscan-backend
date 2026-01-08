import { IsNumber, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { EnumNutritionalGoal } from '../interfaces/interfaces';

export class UpdateGoalDto {
  @IsNumber({}, { message: '*targetWeight deve ser um número' })
  @Type(() => Number)
  @IsNotEmpty({ message: '*targetWeight não pode estar vazio' })
  @IsOptional()
  targetWeight: number;

  @IsNumber({}, { message: '*targetFastingGlucose deve ser um número' })
  @Type(() => Number)
  @IsNotEmpty({ message: '*targetFastingGlucose não pode estar vazio' })
  @IsOptional()
  targetFastingGlucose: number;

  @IsEnum(EnumNutritionalGoal, {
    message: '*nutricionalGoal deve conter valores válidos',
  })
  @IsNotEmpty({ message: '*nutricionalGoal não pode estar vazio' })
  @IsOptional()
  nutricionalGoal: EnumNutritionalGoal;
}
