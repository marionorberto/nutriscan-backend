import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { EnumNutritionalGoal } from '@modules/goals/interfaces/interfaces';

@Entity('goals')
export class Goals {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'target_weight', type: 'decimal' })
  targetWeight: number;

  @Column({ name: 'target_fasting_glucose', type: 'decimal' })
  targetFastingGlucose: number;

  @Column({ name: 'nutricional_goal', type: 'json' })
  nutricionalGoal: EnumNutritionalGoal;

  @ManyToOne(() => User, (users) => users.goals)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
