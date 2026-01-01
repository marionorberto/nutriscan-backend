import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { EnumMedicationType } from '../../../modules/medications/interfaces/interfaces';
import { User } from '../users/user.entity';

@Entity('medications')
export class Medications {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'description', type: 'varchar', length: '100' })
  description: number;

  @Column({ name: 'note', type: 'text' })
  note: string;

  @Column({ name: 'type', type: 'enum', enum: EnumMedicationType })
  type: EnumMedicationType;

  @ManyToOne(() => User, (users) => users.medications)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
