import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { EnumCategoryMedicationForm } from '../../../modules/medications/interfaces/interfaces';

export class CreateMedicationDto {
  @IsString()
  name: string;

  @IsEnum(EnumCategoryMedicationForm)
  form: EnumCategoryMedicationForm;

  /**
   * Dosagem base do medicamento
   * Ex: "500mg", "10ml"
   */
  @IsString()
  dosage: string;

  /**
   * Instruções adicionais
   * Ex: "Tomar após refeições"
   */
  @IsOptional()
  @IsString()
  instructions?: string;

  /**
   * Data de início do tratamento
   */
  @IsDateString()
  startDate: Date;

  /**
   * Data de término (opcional)
   */
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
