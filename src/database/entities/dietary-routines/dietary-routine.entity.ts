import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EnumCulturalPreference } from '../../../modules/dietary-routines/interfaces/interfaces';
import { User } from '../users/user.entity';

@Entity('dietary_routines')
export class DietaryRoutines {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'meals_per_day', type: 'int' })
  mealsPerDay: number;

  @Column({ name: 'favorite_foods', type: 'json', nullable: false })
  favoriteFoods: string;

  @Column({ name: 'foods_to_avoid', type: 'json', nullable: false })
  foodsToAvoid: string;

  @Column({ name: 'meal_schedules', type: 'json', nullable: false })
  mealSchedules: string;

  @Column({
    name: 'cultural_preferences',
    type: 'enum',
    enum: EnumCulturalPreference,
  })
  culturalPreferences: EnumCulturalPreference;

  @Column({ name: 'religious_restrictions', type: 'json' })
  religiousRestrictions: string;

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
