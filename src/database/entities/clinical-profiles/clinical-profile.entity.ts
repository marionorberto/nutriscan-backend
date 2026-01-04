import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EnumPhysicalActivityLevel } from '../../../modules/clinical-profiles/interfaces/interfaces';
import { User } from '../users/user.entity';

@Entity('clinical_profiles')
export class ClinicalProfiles {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'weight', type: 'decimal', nullable: false })
  weight: number;

  @Column({ name: 'height', type: 'decimal', nullable: false })
  height: number;

  @Column({ name: 'bmi', type: 'decimal', nullable: false })
  bmi: number;

  @Column({
    name: 'physical_activity_level',
    type: 'enum',
    enum: EnumPhysicalActivityLevel,
  })
  physicalActivityLevel: EnumPhysicalActivityLevel;

  @Column({
    name: 'active',
    type: 'boolean',
    default: true,
  })
  active: boolean;

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
