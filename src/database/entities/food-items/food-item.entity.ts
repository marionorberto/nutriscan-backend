import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  EnumCategory,
  EnumRecommendationLevel,
} from '../../../modules/food-items/interfaces/interfaces';
import { User } from '../users/user.entity';
import { ReferenceImages } from '../reference-images/reference-image.entity';
import { Recognitions } from '../recognitions/recognition.entity';

@Entity('food_items')
export class FoodItems {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: '100' })
  name: string;

  @Column({ name: 'category', type: 'enum', enum: EnumCategory })
  category: EnumCategory;

  @Column({ name: 'glycemic_index', type: 'decimal' })
  glycemicIndex: number;

  @Column({ name: 'glycemic_load', type: 'decimal' })
  glycemicLoad: number;

  @Column({ name: 'carbohydrates', type: 'decimal' })
  carbohydrates: number;

  @Column({ name: 'fiber', type: 'decimal' })
  fiber: number;

  @Column({ name: 'sugars', type: 'decimal' })
  sugars: number;

  @Column({ name: 'calories', type: 'decimal' })
  calories: number;

  @Column({ name: 'nutritional_description', type: 'text' })
  nutrutionalDescription: string;

  @Column({
    name: 'recommendation_level',
    type: 'enum',
    enum: EnumRecommendationLevel,
  })
  recommendationLevel: EnumRecommendationLevel;

  @ManyToOne(() => User, (users) => users.foodItems)
  user: User;

  @OneToMany(() => ReferenceImages, (ri) => ri.foodItem)
  referenceImage: ReferenceImages[];

  @OneToMany(() => Recognitions, (ri) => ri.foodItem)
  recognitions: Recognitions[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
