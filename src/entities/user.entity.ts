import { RolesEnum } from 'src/enums/roles.enum';
import { User } from 'src/interfaces/user.interface';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('user')
export class UserE implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  national_id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  whatsApp_number?: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  job_number: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  BANK_IBAN?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  address?: string;

  @Column({ type: 'date', name: 'birthday', nullable: true })
  birthday?: Date;

  @Column({
    type: 'enum',
    enum: RolesEnum,
    array: true,
    // default: [RolesEnum.INSPECTOR],
    nullable: false,
  })
  roles: RolesEnum[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deletedAt?: Date;
}
