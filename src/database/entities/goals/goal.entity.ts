import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { EnumMedicationType } from '../../../modules/medications/interfaces/interfaces';
import { User } from '../users/user.entity';

@Entity('goals')
export class Goals {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'target_weight', type: 'decimal' })
  targetWeight: number;

  @Column({ name: 'target_fasting_glucose', type: 'decimal' })
  targetFastingGlucose: number;

  @Column({ name: 'nutricional_goal', type: 'json' }) // can be reduce sugar,increase fiber, it will come on mobile
  nutricionalGoal: EnumMedicationType;

  @ManyToOne(() => User, (users) => users.goals)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
