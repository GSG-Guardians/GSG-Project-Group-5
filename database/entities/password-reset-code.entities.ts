import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entities';

@Entity({ name: 'password_reset_codes' })
@Index(['userId'])
@Index(['expiresAt'])
export class PasswordResetCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (u) => u.resetCodes, { onDelete: 'CASCADE' })
  user: User;

  @Column('varchar', { name: 'code_hash', length: 255 })
  codeHash: string;

  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'timestamptz', name: 'used_at', nullable: true })
  usedAt: Date | null;

  @Column('int', { name: 'attempt_count', default: 0 })
  attemptCount: number;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;
}
