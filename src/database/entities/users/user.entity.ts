import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { Exclude } from 'class-transformer';
import {
  EnumGenderUser,
  EnumTypeUser,
} from '../../../modules/users/interfaces/interfaces';
import { Allergies } from '../allergies/allergy.entity';
import { AssociatedConditions } from '../associated-conditions/associated-condition.entity';
import { FoodItems } from '../food-items/food-item.entity';
import { FoodRecomendations } from '../food-recomendations/food-recomendation.entity';
import { Goals } from '../goals/goal.entity';
import { Medications } from '../medications/medication.entity';
import { Notifications } from '../notifications/notification.entity';
import { Recognitions } from '../recognitions/recognition.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'firstname', type: 'varchar', length: '30' })
  firstname: string;

  @Column({ name: 'lastname', type: 'varchar', length: '30' })
  lastname: string;

  @Column({ name: 'username', type: 'varchar', length: '60', unique: true })
  username: string;

  @Column({ name: 'email', type: 'varchar', length: '60', unique: true })
  email: string;

  @Column({ name: 'birthday', type: 'date' })
  birthday: Date;

  @Column({ name: 'address', type: 'json' })
  address: string;

  @Column({ name: 'main_phone', type: 'varchar', length: '9' })
  phone: string;

  @Column({ name: 'gender', type: 'enum', enum: EnumGenderUser })
  gender: string;

  @Column({ name: 'img', type: 'varchar', nullable: false })
  img: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: EnumTypeUser,
    default: EnumTypeUser.paciente,
  })
  role: EnumTypeUser;

  @Column({
    name: 'active',
    type: 'boolean',
    default: true,
  })
  active: boolean;

  @Column({ name: 'password_hash', type: 'text' })
  @Exclude()
  password: string;

  @Column({ name: 'reset_password_token', type: 'text', nullable: true })
  resetPasswordToken: string;

  @Column({ name: 'reset_password_expires', type: 'timestamp', nullable: true })
  resetPasswordExpires: Date;

  @ManyToMany(() => AssociatedConditions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  associatedCondition: AssociatedConditions[];

  @OneToMany(() => FoodItems, (foodItems) => foodItems.user)
  foodItems: FoodItems[];

  @OneToMany(
    () => FoodRecomendations,
    (foodRecomendations) => foodRecomendations.user,
  )
  foodRecomendation: FoodRecomendations[];

  @OneToMany(() => Goals, (goal) => goal.user)
  goals: Goals[];

  @OneToMany(() => Medications, (medication) => medication.user)
  medications: Medications[];

  @OneToMany(() => Notifications, (notification) => notification.user)
  notifications: Notifications[];

  @OneToMany(() => Recognitions, (recognition) => recognition.user)
  recognitions: Recognitions[];

  @ManyToMany(() => Allergies, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  allergies: Allergies[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.password, salt);
    }
  }
}
