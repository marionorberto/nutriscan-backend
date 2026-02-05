// src/database/entities/GlucoseLog.entity.ts
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

// Types em Português
// src/shared/types/glucose.types.ts (ou similar)
export type GlucoseReadingType =
  | 'JEJUM'
  | 'PRE_REFEICAO'
  | 'POS_REFEICAO_1H'
  | 'POS_REFEICAO_2H'
  | 'POS_REFEICAO_3H'
  | 'ANTES_DORMIR'
  | 'MADRUGA'
  | 'ALEATORIO'
  | 'EXERCICIO'
  | 'SINTOMAS';

export type ExerciseIntensity = 'LEVE' | 'MODERADO' | 'INTENSO';

export type MeasurementDevice = 'CGM' | 'BGM' | 'FGM';

export type ConfidenceLevel = 'BAIXA' | 'MEDIA' | 'ALTA';

export type GlucoseResponse =
  | 'HIPOGLICEMIA' // Hipoglicemia (<70 mg/dL)
  | 'BAIXO' // Baixo (70-100 mg/dL)
  | 'NORMAL' // Normal (100-140 mg/dL)
  | 'ELEVADO' // Elevado (140-180 mg/dL)
  | 'ALTO' // Alto (180-250 mg/dL)
  | 'MUITO_ALTO' // Muito alto (>250 mg/dL)
  | 'CRITICO'; // Crítico (>300 mg/dL)

export type TimeOfDay =
  | 'MANHA' // 5h às 12h
  | 'TARDE' // 12h às 17h
  | 'NOITE' // 17h às 22h
  | 'MADRUGA'; // 22h às 5h

@Entity('glucose_logs')
// @Index(['user', 'readingDate'])
// @Index(['user', 'readingType'])
export class GlucoseLog {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => User, (user) => user.glucoseLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Valor da glicemia
  @Column({ name: 'value', type: 'decimal', precision: 5, scale: 1 })
  value: number; // mg/dL

  // Tipo da leitura
  @Column({
    name: 'reading_type',
    type: 'varchar',
    length: 20,
    default: 'ALEATORIO',
  })
  readingType: GlucoseReadingType;

  // Classificação da resposta glicêmica
  @Column({
    name: 'response',
    type: 'varchar',
    length: 20,
  })
  response: GlucoseResponse;

  // Data e hora da leitura
  @Column({ name: 'reading_at', type: 'timestamp' })
  readingAt: Date;

  // Data apenas (para agrupamentos diários)
  @Column({ name: 'reading_date', type: 'date' })
  readingDate: Date;

  // Horário do dia (manhã, tarde, noite, madrugada)
  @Column({
    name: 'time_of_day',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  timeOfDay: TimeOfDay;

  // Refeição relacionada (se aplicável)
  @Column({
    name: 'related_meal',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  relatedMeal: string; // breakfast, lunch, dinner, snack

  // Observações do usuário
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  // Sintomas relatados (array em JSON)
  @Column({ name: 'symptoms', type: 'json', nullable: true })
  symptoms: string[];

  // Fatores que influenciaram a glicemia
  @Column({ name: 'influencing_factors', type: 'json', nullable: true })
  influencingFactors: {
    stress?: number; // 1-10
    exercise?: {
      type: string;
      duration: number; // minutos
      intensity: ExerciseIntensity;
    };
    medication?: {
      type: string;
      dose: number;
      takenAt: Date;
    };
    illness?: boolean;
    alcohol?: boolean;
    sleepHours?: number;
  };

  // Meta personalizada do usuário (se diferente dos padrões)
  @Column({
    name: 'personal_target',
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  personalTarget: number;

  // Acurácia do sensor/medidor (caso use CGM)
  @Column({
    name: 'measurement_device',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  measurementDevice: MeasurementDevice;

  // Precisão da leitura (confiança do usuário)
  @Column({ name: 'confidence', type: 'varchar', length: 20, default: 'ALTA' })
  confidence: ConfidenceLevel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Construtor com validação automática
  constructor(partial: Partial<GlucoseLog>) {
    Object.assign(this, partial);

    // Se não tiver readingDate, cria a partir do readingAt
    if (this.readingAt && !this.readingDate) {
      this.readingDate = new Date(this.readingAt.toDateString());
    }

    // Classifica automaticamente se não tiver response
    if (this.value && !this.response) {
      this.response = this.classifyGlucoseResponse(this.value);
    }

    // Define timeOfDay se não tiver
    if (this.readingAt && !this.timeOfDay) {
      this.timeOfDay = this.getTimeOfDay(this.readingAt);
    }
  }

  // Método para classificar automaticamente a resposta glicêmica
  private classifyGlucoseResponse(value: number): GlucoseResponse {
    if (value < 70) return 'HIPOGLICEMIA';
    if (value < 100) return 'BAIXO';
    if (value < 140) return 'NORMAL';
    if (value < 180) return 'ELEVADO';
    if (value < 250) return 'ALTO';
    if (value < 300) return 'MUITO_ALTO';
    return 'CRITICO';
  }

  // Método para determinar período do dia
  private getTimeOfDay(date: Date): TimeOfDay {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'MANHA';
    if (hour >= 12 && hour < 17) return 'TARDE';
    if (hour >= 17 && hour < 22) return 'NOITE';
    return 'MADRUGA';
  }

  // Métodos auxiliares de instância
  isHypoglycemic(): boolean {
    return this.response === 'HIPOGLICEMIA';
  }

  isHyperglycemic(): boolean {
    return ['ELEVADO', 'ALTO', 'MUITO_ALTO', 'CRITICO'].includes(this.response);
  }

  isInTargetRange(): boolean {
    return ['BAIXO', 'NORMAL'].includes(this.response);
  }

  getColorCode(): string {
    switch (this.response) {
      case 'HIPOGLICEMIA':
        return '#DC2626'; // Vermelho
      case 'BAIXO':
        return '#F59E0B'; // Âmbar
      case 'NORMAL':
        return '#10B981'; // Verde
      case 'ELEVADO':
        return '#FBBF24'; // Amarelo
      case 'ALTO':
        return '#F97316'; // Laranja
      case 'MUITO_ALTO':
        return '#EF4444'; // Vermelho claro
      case 'CRITICO':
        return '#991B1B'; // Vermelho escuro
      default:
        return '#6B7280'; // Cinza
    }
  }

  getIcon(): string {
    switch (this.response) {
      case 'HIPOGLICEMIA':
        return 'alert-circle';
      case 'BAIXO':
        return 'trending-down';
      case 'NORMAL':
        return 'checkmark-circle';
      case 'ELEVADO':
        return 'trending-up';
      case 'ALTO':
        return 'warning';
      case 'MUITO_ALTO':
        return 'alert';
      case 'CRITICO':
        return 'medical';
      default:
        return 'help-circle';
    }
  }

  getReadingTypeDescription(): string {
    const types = {
      JEJUM: 'Jejum',
      PRE_REFEICAO: 'Pré-refeição',
      POS_REFEICAO_1H: '1h pós-refeição',
      POS_REFEICAO_2H: '2h pós-refeição',
      POS_REFEICAO_3H: '3h pós-refeição',
      ANTES_DORMIR: 'Antes de dormir',
      MADRUGA: 'Madrugada',
      ALEATORIO: 'Aleatório',
      EXERCICIO: 'Exercício',
      SINTOMAS: 'Com sintomas',
    };
    return types[this.readingType] || 'Desconhecido';
  }

  getResponseDescription(): string {
    const responses = {
      HIPOGLICEMIA: 'Hipoglicemia',
      BAIXO: 'Baixo',
      NORMAL: 'Normal',
      ELEVADO: 'Elevado',
      ALTO: 'Alto',
      MUITO_ALTO: 'Muito Alto',
      CRITICO: 'Crítico',
    };
    return responses[this.response] || 'Desconhecido';
  }

  getTimeOfDayDescription(): string {
    const times = {
      MANHA: 'Manhã',
      TARDE: 'Tarde',
      NOITE: 'Noite',
      MADRUGA: 'Madrugada',
    };
    return times[this.timeOfDay] || 'Desconhecido';
  }

  // Método para obter dados formatados para exibição
  getFormattedData() {
    return {
      value: `${this.value} mg/dL`,
      type: this.getReadingTypeDescription(),
      response: this.getResponseDescription(),
      timeOfDay: this.getTimeOfDayDescription(),
      dateTime: this.readingAt.toLocaleString('pt-BR'),
      color: this.getColorCode(),
      icon: this.getIcon(),
      isInTarget: this.isInTargetRange(),
      isAlert: this.isHypoglycemic() || this.response === 'CRITICO',
    };
  }
}
