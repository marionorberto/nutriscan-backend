// src/dto/glucose/UpdateGlucoseLog.dto.ts
import {
  ConfidenceLevel,
  GlucoseReadingType,
  InfluencingFactorsDto,
  MeasurementDevice,
} from './create-glucose-log.dto';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO para atualização parcial
export class UpdateGlucoseLogDto {
  @IsOptional()
  @IsNumber({}, { message: 'O valor da glicemia deve ser um número' })
  @Min(20, { message: 'O valor mínimo da glicemia é 20 mg/dL' })
  @Max(600, { message: 'O valor máximo da glicemia é 600 mg/dL' })
  value?: number;

  @IsOptional()
  @IsEnum(
    [
      'JEJUM',
      'PRE_REFEICAO',
      'POS_REFEICAO_1H',
      'POS_REFEICAO_2H',
      'POS_REFEICAO_3H',
      'ANTES_DORMIR',
      'MADRUGA',
      'ALEATORIO',
      'EXERCICIO',
      'SINTOMAS',
    ],
    {
      message: 'Tipo de leitura inválido',
    },
  )
  readingType?: GlucoseReadingType;

  @IsOptional()
  @IsDateString({}, { message: 'Data/hora da leitura inválida' })
  readingAt?: string;

  @IsOptional()
  @IsString({ message: 'Refeição relacionada deve ser uma string' })
  @MaxLength(50, {
    message: 'Refeição relacionada não pode exceder 50 caracteres',
  })
  relatedMeal?: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID da análise de refeição inválido' })
  mealAnalysisId?: string;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  @MaxLength(2000, { message: 'Observações não podem exceder 2000 caracteres' })
  notes?: string;

  @IsOptional()
  @IsArray({ message: 'Sintomas devem ser um array' })
  @IsString({ each: true, message: 'Cada sintoma deve ser uma string' })
  @ArrayMaxSize(20, { message: 'Máximo de 20 sintomas permitidos' })
  @MaxLength(100, {
    each: true,
    message: 'Cada sintoma não pode exceder 100 caracteres',
  })
  symptoms?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => InfluencingFactorsDto)
  influencingFactors?: InfluencingFactorsDto;

  @IsOptional()
  @IsEnum(['CGM', 'BGM', 'FGM'], {
    message: 'Dispositivo de medição inválido',
  })
  measurementDevice?: MeasurementDevice;

  @IsOptional()
  @IsEnum(['BAIXA', 'MEDIA', 'ALTA'], {
    message: 'Nível de confiança inválido',
  })
  confidence?: ConfidenceLevel;

  @IsOptional()
  @IsNumber({}, { message: 'Meta personalizada deve ser um número' })
  @Min(70, { message: 'Meta personalizada mínima é 70 mg/dL' })
  @Max(250, { message: 'Meta personalizada máxima é 250 mg/dL' })
  personalTarget?: number;
}

export class GlucoseFilterDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsEnum([
    'JEJUM',
    'PRE_REFEICAO',
    'POS_REFEICAO_1H',
    'POS_REFEICAO_2H',
    'POS_REFEICAO_3H',
    'ANTES_DORMIR',
    'MADRUGA',
    'ALEATORIO',
    'EXERCICIO',
    'SINTOMAS',
  ])
  readingType?: string;

  @IsOptional()
  @IsEnum([
    'HIPOGLICEMIA',
    'BAIXO',
    'NORMAL',
    'ELEVADO',
    'ALTO',
    'MUITO_ALTO',
    'CRITICO',
  ])
  response?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
}
