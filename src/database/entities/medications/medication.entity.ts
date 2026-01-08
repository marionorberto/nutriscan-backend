import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EnumCategoryMedicationForm } from '../../../modules/medications/interfaces/interfaces';
import { User } from '../users/user.entity';
import { MedicationSchedule } from '../medication-schedules/medication-schedules.entity';

@Entity('medications')
export class Medications {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: EnumCategoryMedicationForm,
  })
  form: EnumCategoryMedicationForm;

  @Column()
  dosage: string; // ex: "500mg", "10ml"

  @Column({ nullable: true })
  instructions?: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (users) => users.medications)
  user: User;

  @OneToMany(() => MedicationSchedule, (schedule) => schedule.medication, {
    cascade: true,
  })
  schedules: MedicationSchedule[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
