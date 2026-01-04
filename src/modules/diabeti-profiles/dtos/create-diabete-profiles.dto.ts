import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import {
  EnumCurrentStatus,
  EnumDiabetiType,
  EnumHyperGlycemiaFrequency,
  EnumHypoGlycemiaFrequency,
} from '../interfaces/interfaces';

export class CreateDiabeteProfileDto {
  @IsString({ message: '*Tipo_De_Diabete deve ser um texto!' })
  @IsEnum({ enum: EnumCurrentStatus })
  @IsNotEmpty({ message: '*Tipo_De_Diabete não pode estar vazio' })
  diabetiType: EnumDiabetiType;

  @IsDate({ message: '*Ano_De_Diagnóstivo deve estar no formato de data!' })
  @IsNotEmpty({ message: '*Ano_De_Diagnóstivo não pode estar vazio' })
  diagnosisYear: Date;

  @IsString({ message: '*Estado_Actual deve ser um texto!' })
  @IsEnum({ enum: EnumCurrentStatus })
  @IsNotEmpty({ message: '*Estado_Actual não pode estar vazio' })
  currentStatus: EnumCurrentStatus;

  @IsNumber({}, { message: '*lastFastingGlucose, deve ser um texto.' })
  @IsOptional()
  lastFastingGlucose: number;

  @IsNumber({}, { message: '*lastHba1c, deve ser um número.' })
  @IsOptional()
  lastHba1c?: number;

  @IsString({ message: '*hypoGlycemiaFrequency deve ser um texto!' })
  @IsEnum({ enum: EnumHypoGlycemiaFrequency })
  @IsNotEmpty({ message: '*hypoGlycemiaFrequency não pode estar vazio' })
  hypoGlycemiaFrequency: EnumHypoGlycemiaFrequency;

  @IsString({ message: '*hyperGlycemiaFrequency deve ser um texto!' })
  @IsEnum({ enum: EnumHyperGlycemiaFrequency })
  @IsNotEmpty({ message: '*hyperGlycemiaFrequency não pode estar vazio' })
  hyperGlycemiaFrequency: EnumHyperGlycemiaFrequency;
}
