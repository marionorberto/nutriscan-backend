import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EnumTheme } from '../../../modules/app-settings/interfaces/interfaces';
import { User } from '../users/user.entity';

@Entity('app-settings')
export class AppSettings {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'save_image_history', type: 'boolean' })
  saveImageHistory: boolean;

  @Column({ name: 'enable_nutricional_alert', type: 'boolean' })
  enableNutricionalAlert: boolean;

  @Column({ name: 'share_data_for_training', type: 'boolean' })
  shareDataForTraining: string;

  @Column({ name: 'notification_enabled', type: 'boolean' })
  notificationEnabled: string;

  @Column({
    name: 'theme',
    type: 'enum',
    enum: EnumTheme,
    default: EnumTheme.light,
  })
  theme: EnumTheme;

  // relation with user missing:
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
