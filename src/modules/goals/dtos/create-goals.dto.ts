import { IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EnumNutritionalGoal } from '../interfaces/interfaces';

export class CreateGoalDto {
  @IsNumber({}, { message: '*targetWeight deve ser um número' })
  @Type(() => Number)
  @IsNotEmpty({ message: '*targetWeight não pode estar vazio' })
  targetWeight: number;

  @IsNumber({}, { message: '*targetFastingGlucose deve ser um número' })
  @Type(() => Number)
  @IsNotEmpty({ message: '*targetFastingGlucose não pode estar vazio' })
  targetFastingGlucose: number;

  @IsEnum(EnumNutritionalGoal, {
    message: '*nutricionalGoal deve conter valores válidos',
  })
  @IsNotEmpty({ message: '*nutricionalGoal não pode estar vazio' })
  nutricionalGoal: EnumNutritionalGoal;
}
