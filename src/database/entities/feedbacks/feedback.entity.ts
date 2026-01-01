import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EnumFeedbackType } from '../../../modules/feedbacks/interfaces/interfaces';
import { User } from '../users/user.entity';

@Entity('feedbacks')
export class Feedbacks {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'rate', type: 'int' })
  rate: number;

  @Column({ name: 'feedback_type', type: 'enum', enum: EnumFeedbackType })
  feedbackType: EnumFeedbackType;

  @Column({ name: 'comment', type: 'text' })
  comment: string;

  // relation with *user missing:
  @OneToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  // relation with *food missing:
  // relation with *recognition missing:

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
