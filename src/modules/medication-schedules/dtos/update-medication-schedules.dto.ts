import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { MedicationFrequency } from '../interfaces/interfaces';

export class UpdateMedicationScheduleDto {
  /**
   * Horário no formato HH:mm
   * Ex: 08:00, 20:30
   */
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'O horário deve estar no formato HH:mm',
  })
  @IsOptional()
  time: string;

  /**
   * Dias da semana
   * 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
   */
  @IsNotEmpty({ message: 'Dias_Da_Semana não poder estar vazia' })
  @IsOptional()
  daysOfWeek: string;

  @IsEnum({ enum: MedicationFrequency, message: '*Frequência não espec.' })
  @IsOptional()
  frequency: MedicationFrequency;

  /**
   * Quantidade a tomar nesse horário
   * Ex: "1 comprimido", "10ml"
   */
  @IsString()
  @IsOptional()
  quantity: string;

  @IsBoolean()
  @IsOptional()
  reminderEnabled?: boolean = true;
}
