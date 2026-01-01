import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { FoodItems } from '../food-items/food-item.entity';

@Entity('recognitions')
export class Recognitions {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'mode_accurancy', type: 'decimal' })
  modeAccurancy: number;

  @Column({ name: 'image_path', type: 'text' })
  imagePath: string;

  @CreateDateColumn({ name: 'timestamp', type: 'timestamp' })
  timestamp: Date;

  // relation with user missing:
  @ManyToOne(() => User, (users) => users.recognitions)
  user: User;
  // relation with food missing:
  @ManyToOne(() => FoodItems, (fi) => fi.recognitions)
  foodItem: FoodItems;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
