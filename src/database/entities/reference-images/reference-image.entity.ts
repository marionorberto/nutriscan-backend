import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { FoodItems } from '../food-items/food-item.entity';

@Entity('referenced-images')
export class ReferencedImages {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'image_type', type: 'varchar', nullable: false })
  imageType: string;

  @Column({ name: 'filename', type: 'text' })
  filename: string;

  @Column({ name: 'file_path', type: 'text' })
  filepath: string;

  // relation with *food missing:
  @OneToMany(() => FoodItems, (foodItems) => foodItems.referenceImage)
  foodItem: FoodItems[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
