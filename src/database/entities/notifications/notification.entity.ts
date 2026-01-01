import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import {
  EnumCategory,
  EnumStatus,
} from '../../../modules/notifications/interfaces/interfaces';
import { User } from '../users/user.entity';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'read_at', type: 'timestamp' })
  readAt: Date;

  @Column({ name: 'status', type: 'enum', enum: EnumStatus })
  status: EnumStatus;

  @Column({ name: 'category', type: 'enum', enum: EnumCategory })
  category: EnumCategory;

  @Column({ name: 'emoji', type: 'text' })
  emoji: string;

  @Column({ name: 'url_action', type: 'text' })
  urlAction: string;

  @ManyToOne(() => User, (users) => users.notifications)
  user: User;

  @CreateDateColumn({ name: 'send_at', type: 'timestamp' })
  sendAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
