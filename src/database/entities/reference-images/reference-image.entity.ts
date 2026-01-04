import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { EnumImageType } from '../../../modules/reference-images/interfaces/interfaces';
import { FoodItems } from '../food-items/food-item.entity';

@Entity('reference-images')
export class ReferenceImages {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'image_type', type: 'enum', enum: EnumImageType })
  imageType: EnumImageType;

  @Column({ name: 'file_path', type: 'text' })
  filePath: string;

  // relation with *food missing:
  @OneToMany(() => FoodItems, (foodItems) => foodItems.referenceImage)
  foodItem: FoodItems[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
