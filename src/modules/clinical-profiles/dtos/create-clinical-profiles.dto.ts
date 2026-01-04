import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { EnumPhysicalActivityLevel } from '../interfaces/interfaces';

export class CreateClinicalProfileDto {
  @IsNumber({}, { message: '*Peso deve ser um número' })
  @IsNotEmpty({ message: '*Peso não pode estar vazia!' })
  weight: number;

  @IsNumber({}, { message: '*Altura deve ser um número' })
  @IsNotEmpty({ message: '*Altura não pode estar vazia!' })
  height: number;

  @IsNumber({}, { message: '*IMC deve ser um número' })
  @IsNotEmpty({ message: '*IMC não pode estar vazia!' })
  bmi: number;

  @IsString({ message: '*Nivel_De_Actividade_Física deve ser um texto!' })
  @IsEnum({ enum: EnumPhysicalActivityLevel })
  @IsNotEmpty({ message: '*Nivel_De_Actividade_Física não pode estar vazia!' })
  physicalActivityLevel: EnumPhysicalActivityLevel;
}
