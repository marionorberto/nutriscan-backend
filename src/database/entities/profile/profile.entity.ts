import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { EnumGenderUser } from '@modules/profiles/interfaces/interfaces';

@Entity('profiles')
export class Profiles {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

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
