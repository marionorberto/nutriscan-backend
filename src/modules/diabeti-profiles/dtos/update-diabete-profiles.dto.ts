import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDiabeteProfileDto {
  @IsString({ message: '*Tipo_De_Diabete deve ser um texto!' })
  @IsNotEmpty({ message: '*Tipo_De_Diabete não pode estar vazio' })
  @IsOptional()
  diabetiType: string;

  @Transform(({ value }) => new Date(Number(value), 0, 1))
  @IsNotEmpty({ message: '*Ano_De_Diagnóstivo não pode estar vazio' })
  @IsOptional()
  diagnosisYear: string;

  @IsString({ message: '*Estado_Actual deve ser um texto!' })
  @IsNotEmpty({ message: '*Estado_Actual não pode estar vazio' })
  @IsOptional()
  currentStatus: string;

  @IsNumber({}, { message: '*lastFastingGlucose, deve ser um texto.' })
  @IsOptional()
  @IsOptional()
  lastFastingGlucose: number;

  @IsNumber({}, { message: '*lastHba1c, deve ser um número.' })
  @IsOptional()
  @IsOptional()
  lastHba1c?: number;

  @IsString({ message: '*hypoGlycemiaFrequency deve ser um texto!' })
  @IsNotEmpty({ message: '*hypoGlycemiaFrequency não pode estar vazio' })
  @IsOptional()
  hypoGlycemiaFrequency: string;

  @IsString({ message: '*hyperGlycemiaFrequency deve ser um texto!' })
  @IsNotEmpty({ message: '*hyperGlycemiaFrequency não pode estar vazio' })
  @IsOptional()
  hyperGlycemiaFrequency: string;

  @IsNotEmpty({ message: '*id não pode estar vazio' })
  id: string;
}
