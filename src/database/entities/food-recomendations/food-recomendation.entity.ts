import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { EnumRecomendationType } from '../../../modules/food-recomendations/interfaces/interfaces';
import { User } from '../users/user.entity';

@Entity('food_recomendations')
export class FoodRecomendations {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'recomendation_type',
    type: 'enum',
    enum: EnumRecomendationType,
  })
  recomendationType: EnumRecomendationType;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'scientific_justification', type: 'text' })
  scientificJustification: string;

  @ManyToOne(() => User, (users) => users.foodRecomendation)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
