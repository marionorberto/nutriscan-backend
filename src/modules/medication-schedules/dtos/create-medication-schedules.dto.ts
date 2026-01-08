import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { MedicationFrequency } from '../interfaces/interfaces';

export class CreateMedicationScheduleDto {
  @IsString()
  @IsNotEmpty({ message: 'Dias_Da_Semana não poder estar vazia' })
  medication: string;

  /**
   * Horário no formato HH:mm
   * Ex: 08:00, 20:30
   */
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'O horário deve estar no formato HH:mm',
  })
  time: string;

  /**
   * Dias da semana
   * 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
   */
  @IsNotEmpty({ message: 'Dias_Da_Semana não poder estar vazia' })
  daysOfWeek: string;

  @IsEnum({ enum: MedicationFrequency, message: '*Frequência não espec.' })
  frequency: MedicationFrequency;

  /**
   * Quantidade a tomar nesse horário
   * Ex: "1 comprimido", "10ml"
   */
  @IsString()
  quantity: string;

  @IsOptional()
  @IsBoolean()
  reminderEnabled?: boolean = true;
}
