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

@Entity('profile_admin')
export class ProfileAdmin {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'birthday', type: 'date' })
  birthday: Date;

  @Column({ name: 'address', type: 'json' })
  address: string;

  @Column({ name: 'main_phone', type: 'varchar', length: '9' })
  phone: string;

  @Column({ name: 'gender', type: 'varchar' })
  gender: string;

  @Column({ name: 'job', type: 'varchar' })
  job: string;

  @Column({ name: 'bio', type: 'text' })
  bio: string;

  @Column({ name: 'linkedin_url', type: 'varchar' })
  linkedinUrl: string;

  @Column({ name: 'facebook_url', type: 'varchar' })
  facebookUrl: string;

  @Column({ name: 'bi', type: 'varchar' })
  bi: string;

  @Column({ name: 'postal_code', type: 'varchar', nullable: true })
  postalCode: string;

  @Column({ name: 'img', type: 'varchar', nullable: false })
  img: string;

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
