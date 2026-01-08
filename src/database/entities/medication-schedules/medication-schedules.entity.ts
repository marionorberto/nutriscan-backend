import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Medications } from '../medications/medication.entity';

export enum MedicationFrequency {
  DAILY = 'Diário',
  SPECIFIC_DAYS = 'Dias_específicos',
  ALTERNATE_DAYS = 'Dias_alternados',
}

@Entity('medication_schedules')
export class MedicationSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'time', type: 'time', nullable: false })
  time: string; // ex: "08:00"

  @Column({ name: 'day_of_week', type: 'json', nullable: true })
  daysOfWeek?: string; // 0=Domingo ... 6=Sábado

  @Column({
    name: 'frequency',
    type: 'enum',
    enum: MedicationFrequency,
    default: MedicationFrequency.DAILY,
  })
  frequency: MedicationFrequency;

  @Column({ name: 'reminder_enabled', type: 'boolean', default: true })
  reminderEnabled: boolean;

  @Column({ name: 'quantity', type: 'varchar' })
  quantity: string; // ex: "1 comprimido", "10ml"

  @ManyToOne(() => Medications, (medication) => medication.schedules, {
    onDelete: 'CASCADE',
  })
  medication: Medications;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
