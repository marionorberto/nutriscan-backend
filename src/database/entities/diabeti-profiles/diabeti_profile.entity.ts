import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import {
  EnumCurrentStatus,
  EnumDiabetiType,
  EnumHyperGlycemiaFrequency,
  EnumHypoGlycemiaFrequency,
} from '../../../modules/diabeti-profiles/interfaces/interfaces';
import { User } from '../users/user.entity';

@Entity('diabeti_profiles')
export class DiabeteProfiles {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'diabeti_type', type: 'enum', enum: EnumDiabetiType })
  diabetiType: EnumDiabetiType;

  @Column({ name: 'diagnosis_year', type: 'date' })
  diagnosisYear: Date;

  @Column({ name: 'current_status', type: 'enum', enum: EnumCurrentStatus })
  currentStatus: EnumCurrentStatus;

  @Column({ name: 'last_fasting_glucose', type: 'decimal' })
  lastFastingGlucose: number;

  @Column({ name: 'last_hba1c', type: 'decimal' })
  lastHba1c: number;

  @Column({ name: 'hypo_glycemia_frequency', type: 'varchar' })
  hypoGlycemiaFrequency: EnumHypoGlycemiaFrequency;

  @Column({ name: 'hyper_glycemia_frequency', type: 'varchar' })
  hyperGlycemiaFrequency: EnumHyperGlycemiaFrequency;

  @OneToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
