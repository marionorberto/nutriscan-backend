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
  EnumNotificationCreator,
  EnumStatus,
} from '../../../modules/notifications/interfaces/interfaces';
import { User } from '../users/user.entity';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'subtitle', type: 'varchar', nullable: true })
  subtitle: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: EnumStatus,
    default: EnumStatus.unread,
  })
  status: EnumStatus;

  @Column({ name: 'category', type: 'enum', enum: EnumCategory })
  category: EnumCategory;

  @Column({ name: 'emoji', type: 'text' })
  emoji: string;

  @Column({ name: 'url_action', type: 'text', nullable: true })
  urlAction: string;

  @ManyToOne(() => User, (users) => users.notifications, { nullable: true })
  user: User;

  @Column({ name: 'createdBy', type: 'enum', enum: EnumNotificationCreator })
  createdBy: EnumNotificationCreator;

  @CreateDateColumn({ name: 'send_at', type: 'timestamp' })
  sendAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
