// src/database/entities/MealAnalysis.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('meal_analysis')
export class MealAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (users) => users.goals)
  user: User;

  @Column({ type: 'varchar', length: 50 })
  occasion: string; // breakfast, lunch, dinner, snack

  @Column({ type: 'timestamp' })
  mealTimestamp: Date;

  @Column({ type: 'boolean', default: true })
  success: boolean;

  @Column({ type: 'json' })
  processedData: any;

  @Column({ type: 'json' })
  aiAnalysis: any;

  // Métricas principais
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalCalories: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalCarbs: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalNetCarbs: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalFiber: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalProtein: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalFat: number;

  @Column({ type: 'varchar', length: 20 })
  diabeticSuitability: string; // excellent, good, moderate, poor

  @Column({ type: 'varchar', length: 10 })
  safetyStatus: string; // GREEN, YELLOW, RED

  @Column({ type: 'boolean' })
  isRecommended: boolean;

  // Campos para gerenciamento
  @Column({ type: 'boolean', default: false })
  isFavorite: boolean;

  @Column({ type: 'text', nullable: true })
  userNotes: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bloodGlucoseBefore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bloodGlucoseAfter: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  glucoseResponse: string; // LOW, NORMAL, HIGH

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Construtor para facilitar criação
  constructor(partial: Partial<MealAnalysis>) {
    Object.assign(this, partial);
  }
}
