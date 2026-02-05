// src/modules/glucose/dtos/glucose-log.dto.ts
import {
  IsUUID,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  IsString,
  IsArray,
  Min,
  Max,
  ValidateNested,
  IsBoolean,
  IsNotEmpty,
  IsPositive,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export type GlucoseReadingType =
  | 'JEJUM'
  | 'PRE_REFEICAO'
  | 'POS_REFEICAO_1H'
  | 'POS_REFEICAO_2H'
  | 'POS_REFEICAO_3H'
  | 'ANTES_DORMIR'
  | 'MADRUGA'
  | 'ALEATORIO'
  | 'EXERCICIO'
  | 'SINTOMAS';

export type ExerciseIntensity = 'LEVE' | 'MODERADO' | 'INTENSO';

export type MeasurementDevice = 'CGM' | 'BGM' | 'FGM';

export type ConfidenceLevel = 'BAIXA' | 'MEDIA' | 'ALTA';

export type GlucoseResponse =
  | 'HIPOGLICEMIA'
  | 'BAIXO'
  | 'NORMAL'
  | 'ELEVADO'
  | 'ALTO'
  | 'MUITO_ALTO'
  | 'CRITICO';

export type TimeOfDay = 'MANHA' | 'TARDE' | 'NOITE' | 'MADRUGA';

// Sub-DTOs para estruturas aninhadas
export class ExerciseDto {
  @IsString({ message: 'O tipo de exercício deve ser uma string' })
  @IsNotEmpty({ message: 'O tipo de exercício é obrigatório' })
  @MaxLength(100, {
    message: 'O tipo de exercício não pode exceder 100 caracteres',
  })
  type: string;

  @IsNumber({}, { message: 'A duração deve ser um número' })
  @IsPositive({ message: 'A duração deve ser positiva' })
  @Min(1, { message: 'A duração mínima é 1 minuto' })
  @Max(480, { message: 'A duração máxima é 480 minutos (8 horas)' })
  duration: number;

  @IsEnum(['LEVE', 'MODERADO', 'INTENSO'], {
    message: 'A intensidade deve ser LEVE, MODERADO ou INTENSO',
  })
  intensity: ExerciseIntensity;
}

export class MedicationDto {
  @IsString({ message: 'O tipo de medicamento deve ser uma string' })
  @IsNotEmpty({ message: 'O tipo de medicamento é obrigatório' })
  @MaxLength(100, {
    message: 'O tipo de medicamento não pode exceder 100 caracteres',
  })
  type: string;

  @IsNumber({}, { message: 'A dose deve ser um número' })
  @Min(0, { message: 'A dose não pode ser negativa' })
  @Max(1000, { message: 'A dose máxima é 1000' })
  dose: number;

  @IsDateString({}, { message: 'Data de tomada inválida' })
  takenAt: string;
}

export class InfluencingFactorsDto {
  @IsOptional()
  @IsNumber({}, { message: 'O nível de estresse deve ser um número' })
  @Min(1, { message: 'O nível de estresse mínimo é 1' })
  @Max(10, { message: 'O nível de estresse máximo é 10' })
  stress?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ExerciseDto)
  exercise?: ExerciseDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MedicationDto)
  medication?: MedicationDto;

  @IsOptional()
  @IsBoolean({ message: 'Doença deve ser um valor booleano' })
  illness?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Álcool deve ser um valor booleano' })
  alcohol?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Horas de sono devem ser um número' })
  @Min(0, { message: 'Horas de sono não podem ser negativas' })
  @Max(24, { message: 'Horas de sono não podem exceder 24' })
  sleepHours?: number;
}

// DTO Principal
export class GlucoseLogDto {
  @IsNumber({}, { message: 'O valor da glicemia deve ser um número' })
  @Min(20, { message: 'O valor mínimo da glicemia é 20 mg/dL' })
  @Max(600, { message: 'O valor máximo da glicemia é 600 mg/dL' })
  value: number;

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
  @IsOptional()
  readingType: GlucoseReadingType = 'ALEATORIO';

  @IsEnum(
    [
      'HIPOGLICEMIA',
      'BAIXO',
      'NORMAL',
      'ELEVADO',
      'ALTO',
      'MUITO_ALTO',
      'CRITICO',
    ],
    {
      message: 'Resposta glicêmica inválida',
    },
  )
  @IsOptional()
  response?: GlucoseResponse;

  @IsDateString({}, { message: 'Data/hora da leitura inválida' })
  @IsOptional()
  readingAt?: string = new Date().toISOString();

  @IsDateString({}, { message: 'Data da leitura inválida' })
  @IsOptional()
  readingDate?: string;

  @IsEnum(['MANHA', 'TARDE', 'NOITE', 'MADRUGA'], {
    message: 'Período do dia inválido',
  })
  @IsOptional()
  timeOfDay?: TimeOfDay;

  @IsString({ message: 'Refeição relacionada deve ser uma string' })
  @IsOptional()
  @MaxLength(50, {
    message: 'Refeição relacionada não pode exceder 50 caracteres',
  })
  relatedMeal?: string;

  @IsUUID('4', { message: 'ID da análise de refeição inválido' })
  @IsOptional()
  mealAnalysisId?: string;

  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  @MaxLength(2000, { message: 'Observações não podem exceder 2000 caracteres' })
  notes?: string;

  @IsArray({ message: 'Sintomas devem ser um array' })
  @IsOptional()
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

  @IsNumber({}, { message: 'Média de 7 dias deve ser um número' })
  @IsOptional()
  @Min(20, { message: 'Média de 7 dias mínima é 20 mg/dL' })
  @Max(600, { message: 'Média de 7 dias máxima é 600 mg/dL' })
  sevenDayAvg?: number;

  @IsNumber({}, { message: 'Média de 14 dias deve ser um número' })
  @IsOptional()
  @Min(20, { message: 'Média de 14 dias mínima é 20 mg/dL' })
  @Max(600, { message: 'Média de 14 dias máxima é 600 mg/dL' })
  fourteenDayAvg?: number;

  @IsNumber({}, { message: 'Média de 30 dias deve ser um número' })
  @IsOptional()
  @Min(20, { message: 'Média de 30 dias mínima é 20 mg/dL' })
  @Max(600, { message: 'Média de 30 dias máxima é 600 mg/dL' })
  thirtyDayAvg?: number;

  @IsNumber({}, { message: 'HbA1c estimada deve ser um número' })
  @IsOptional()
  @Min(3, { message: 'HbA1c estimada mínima é 3%' })
  @Max(20, { message: 'HbA1c estimada máxima é 20%' })
  estimatedHbA1c?: number;

  @IsNumber({}, { message: 'Tempo no alvo deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'Tempo no alvo mínimo é 0%' })
  @Max(100, { message: 'Tempo no alvo máximo é 100%' })
  timeInRange?: number;

  @IsNumber({}, { message: 'Variabilidade glicêmica deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'Variabilidade glicêmica mínima é 0%' })
  @Max(100, { message: 'Variabilidade glicêmica máxima é 100%' })
  glycemicVariability?: number;

  @IsNumber({}, { message: 'Meta personalizada deve ser um número' })
  @IsOptional()
  @Min(70, { message: 'Meta personalizada mínima é 70 mg/dL' })
  @Max(250, { message: 'Meta personalizada máxima é 250 mg/dL' })
  personalTarget?: number;

  @IsEnum(['CGM', 'BGM', 'FGM'], {
    message: 'Dispositivo de medição inválido',
  })
  @IsOptional()
  measurementDevice?: MeasurementDevice;

  @IsEnum(['BAIXA', 'MEDIA', 'ALTA'], {
    message: 'Nível de confiança inválido',
  })
  @IsOptional()
  confidence: ConfidenceLevel = 'ALTA';
}

// DTO para criação (sem campos calculados)
export class CreateGlucoseLogDto {
  @IsNotEmpty({ message: 'Valor da glicemia é obrigatório' })
  @IsNumber({}, { message: 'O valor da glicemia deve ser um número' })
  @Min(20, { message: 'O valor mínimo da glicemia é 20 mg/dL' })
  @Max(600, { message: 'O valor máximo da glicemia é 600 mg/dL' })
  value: number;

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
  @IsOptional()
  readingType: GlucoseReadingType = 'ALEATORIO';

  @IsDateString({}, { message: 'Data/hora da leitura inválida' })
  @IsOptional()
  readingAt?: string = new Date().toISOString();

  @IsString({ message: 'Refeição relacionada deve ser uma string' })
  @IsOptional()
  @MaxLength(50, {
    message: 'Refeição relacionada não pode exceder 50 caracteres',
  })
  relatedMeal?: string;

  @IsUUID('4', { message: 'ID da análise de refeição inválido' })
  @IsOptional()
  mealAnalysisId?: string;

  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  @MaxLength(2000, { message: 'Observações não podem exceder 2000 caracteres' })
  notes?: string;

  @IsArray({ message: 'Sintomas devem ser um array' })
  @IsOptional()
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

  @IsEnum(['CGM', 'BGM', 'FGM'], {
    message: 'Dispositivo de medição inválido',
  })
  @IsOptional()
  measurementDevice?: MeasurementDevice;

  @IsEnum(['BAIXA', 'MEDIA', 'ALTA'], {
    message: 'Nível de confiança inválido',
  })
  @IsOptional()
  confidence: ConfidenceLevel = 'ALTA';

  @IsNumber({}, { message: 'Meta personalizada deve ser um número' })
  @IsOptional()
  @Min(70, { message: 'Meta personalizada mínima é 70 mg/dL' })
  @Max(250, { message: 'Meta personalizada máxima é 250 mg/dL' })
  personalTarget?: number;
}

// DTO para resposta
export class GlucoseLogResponseDto {
  id: string;
  userId: string;
  value: number;
  readingType: GlucoseReadingType;
  response: GlucoseResponse;
  readingAt: Date;
  readingDate: Date;
  timeOfDay: TimeOfDay;
  relatedMeal?: string;
  mealAnalysisId?: string;
  notes?: string;
  symptoms?: string[];
  influencingFactors?: InfluencingFactorsDto;
  sevenDayAvg?: number;
  fourteenDayAvg?: number;
  thirtyDayAvg?: number;
  estimatedHbA1c?: number;
  timeInRange?: number;
  glycemicVariability?: number;
  personalTarget?: number;
  measurementDevice?: MeasurementDevice;
  confidence: ConfidenceLevel;
  createdAt: Date;
  updatedAt: Date;

  // Métodos de instância convertidos
  isHypoglycemic: boolean;
  isHyperglycemic: boolean;
  isInTargetRange: boolean;
  colorCode: string;
  icon: string;
  readingTypeDescription: string;
  responseDescription: string;
  timeOfDayDescription: string;
  formattedData: {
    value: string;
    type: string;
    response: string;
    timeOfDay: string;
    dateTime: string;
    color: string;
    icon: string;
    isInTarget: boolean;
    isAlert: boolean;
  };
}

// Validação customizada para datas
export function IsValidReadingDate(date: Date): boolean {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  return date >= oneYearAgo && date <= now;
}

// Validação customizada para valores de glicemia
export function IsValidGlucoseValue(value: number): boolean {
  return value >= 20 && value <= 600;
}
