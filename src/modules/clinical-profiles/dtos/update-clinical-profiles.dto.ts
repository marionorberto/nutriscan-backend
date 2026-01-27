import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateClinicalProfileDto {
  @IsNumber({}, { message: '*Peso deve ser um número' })
  @IsNotEmpty({ message: '*Peso não pode estar vazia!' })
  @IsOptional()
  weight: number;

  @IsNumber({}, { message: '*Altura deve ser um número' })
  @IsNotEmpty({ message: '*Altura não pode estar vazia!' })
  @IsOptional()
  height: number;

  @IsNumber({}, { message: '*IMC deve ser um número' })
  @IsNotEmpty({ message: '*IMC não pode estar vazia!' })
  @IsOptional()
  bmi: number;

  @IsString({ message: '*Nivel_De_Actividade_Física deve ser um texto!' })
  @IsNotEmpty({ message: '*Nivel_De_Actividade_Física não pode estar vazia!' })
  @IsOptional()
  physicalActivityLevel: string;

  @IsNotEmpty({ message: '*id não pode estar vazio!' })
  id: string;
}
