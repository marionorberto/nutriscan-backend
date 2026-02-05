// src/database/entities/DailyGlucoseSummary.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('daily_glucose_summaries')
// @Unique(['userId', 'date'])
// @Index(['userId', 'date'])
export class DailyGlucoseSummary {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => User, (user) => user.dailySummaries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  // Data do resumo
  @Column({ name: 'date', type: 'date' })
  date: Date;

  // Contagens por tipo de leitura
  @Column({ name: 'total_readings', type: 'int', default: 0 })
  totalReadings: number;

  @Column({ name: 'fasting_readings', type: 'int', default: 0 })
  fastingReadings: number;

  @Column({ name: 'pre_meal_readings', type: 'int', default: 0 })
  preMealReadings: number;

  @Column({ name: 'post_meal_readings', type: 'int', default: 0 })
  postMealReadings: number;

  // Médias
  @Column({
    name: 'average_glucose',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  averageGlucose: number;

  @Column({
    name: 'fasting_average',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  fastingAverage: number;

  @Column({
    name: 'pre_meal_average',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  preMealAverage: number;

  @Column({
    name: 'post_meal_average',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  postMealAverage: number;

  // Contagens por resposta glicêmica
  @Column({ name: 'hypoglycemic_count', type: 'int', default: 0 })
  hypoglycemicCount: number;

  @Column({ name: 'normal_count', type: 'int', default: 0 })
  normalCount: number;

  @Column({ name: 'hyperglycemic_count', type: 'int', default: 0 })
  hyperglycemicCount: number;

  // Porcentagem de tempo no alvo
  @Column({
    name: 'time_in_range_percent',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  timeInRangePercent: number;

  // Glicemia mais alta do dia
  @Column({
    name: 'highest_glucose',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  highestGlucose: number;

  // Horário da glicemia mais alta
  @Column({ name: 'highest_glucose_time', type: 'time', nullable: true })
  highestGlucoseTime: string;

  // Glicemia mais baixa do dia
  @Column({
    name: 'lowest_glucose',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  lowestGlucose: number;

  // Horário da glicemia mais baixa
  @Column({ name: 'lowest_glucose_time', type: 'time', nullable: true })
  lowestGlucoseTime: string;

  // Variabilidade glicêmica (desvio padrão)
  @Column({
    name: 'standard_deviation',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  standardDeviation: true;

  // Coeficiente de variação
  @Column({
    name: 'coefficient_variation',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  coefficientVariation: number;

  // Média estimada para cálculo de HbA1c
  @Column({
    name: 'estimated_average_glucose',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  estimatedAverageGlucose: number;

  // HbA1c estimada
  @Column({
    name: 'estimated_hb_a1c',
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: true,
  })
  estimatedHbA1c: number;

  // Meta diária atingida?
  @Column({ name: 'daily_target_achieved', type: 'boolean', default: false })
  dailyTargetAchieved: boolean;

  // Pontuação diária (0-100)
  @Column({ name: 'daily_score', type: 'int', nullable: true })
  dailyScore: number;

  // Observações gerais do dia
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  // Flags para eventos especiais
  @Column({ name: 'had_hypoglycemia', type: 'boolean', default: false })
  hadHypoglycemia: boolean;

  @Column({ name: 'had_hyperglycemia', type: 'boolean', default: false })
  hadHyperglycemia: boolean;

  @Column({ name: 'had_exercise', type: 'boolean', default: false })
  hadExercise: boolean;

  @Column({ name: 'was_sick', type: 'boolean', default: false })
  wasSick: boolean;

  @Column({ name: 'had_stress', type: 'boolean', default: false })
  hadStress: boolean;

  // Média móvel de 7 dias (atualizada diariamente)
  @Column({
    name: 'seven_day_moving_avg',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  sevenDayMovingAvg: number;

  // Média móvel de 14 dias
  @Column({
    name: 'fourteen_day_moving_avg',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  fourteenDayMovingAvg: number;

  // Média móvel de 30 dias
  @Column({
    name: 'thirty_day_moving_avg',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  thirtyDayMovingAvg: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<DailyGlucoseSummary>) {
    Object.assign(this, partial);
  }

  // Métodos auxiliares
  getDayOfWeek(): string {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[this.date.getDay()];
  }

  getFormattedDate(): string {
    return this.date.toLocaleDateString('pt-BR');
  }

  calculateDailyScore(): number {
    // Pontuação baseada em vários fatores
    let score = 100;

    // Penaliza por hipoglicemias
    score -= this.hypoglycemicCount * 15;

    // Penaliza por hiperglicemias
    score -= this.hyperglycemicCount * 10;

    // Bônus por tempo no alvo
    if (this.timeInRangePercent && this.timeInRangePercent > 70) {
      score += 10;
    }

    // Penaliza por alta variabilidade
    if (this.coefficientVariation && this.coefficientVariation > 36) {
      score -= 20;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  getDailyStatus(): {
    status: 'EXCELENTE' | 'BOM' | 'REGULAR' | 'RUIM';
    color: string;
    icon: string;
  } {
    if (this.dailyScore >= 90) {
      return { status: 'EXCELENTE', color: '#10B981', icon: 'trophy' };
    } else if (this.dailyScore >= 70) {
      return { status: 'BOM', color: '#3B82F6', icon: 'checkmark-circle' };
    } else if (this.dailyScore >= 50) {
      return { status: 'REGULAR', color: '#F59E0B', icon: 'warning' };
    } else {
      return { status: 'RUIM', color: '#EF4444', icon: 'alert-circle' };
    }
  }
}
