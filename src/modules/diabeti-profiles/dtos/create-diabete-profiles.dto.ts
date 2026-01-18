import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateDiabeteProfileDto {
  @IsString({ message: '*Tipo_De_Diabete deve ser um texto!' })
  @IsNotEmpty({ message: '*Tipo_De_Diabete não pode estar vazio' })
  diabetiType: string;

  @Transform(({ value }) => new Date(Number(value), 0, 1))
  @IsNotEmpty({ message: '*Ano_De_Diagnóstivo não pode estar vazio' })
  diagnosisYear: string;

  @IsString({ message: '*Estado_Actual deve ser um texto!' })
  @IsNotEmpty({ message: '*Estado_Actual não pode estar vazio' })
  currentStatus: string;

  @IsNumber({}, { message: '*lastFastingGlucose, deve ser um texto.' })
  @IsOptional()
  lastFastingGlucose: number;

  @IsNumber({}, { message: '*lastHba1c, deve ser um número.' })
  @IsOptional()
  lastHba1c?: number;

  @IsString({ message: '*hypoGlycemiaFrequency deve ser um texto!' })
  @IsNotEmpty({ message: '*hypoGlycemiaFrequency não pode estar vazio' })
  hypoGlycemiaFrequency: string;

  @IsString({ message: '*hyperGlycemiaFrequency deve ser um texto!' })
  @IsNotEmpty({ message: '*hyperGlycemiaFrequency não pode estar vazio' })
  hyperGlycemiaFrequency: string;

  @IsNotEmpty({ message: '*user não pode estar vazio' })
  userID: string;
}
