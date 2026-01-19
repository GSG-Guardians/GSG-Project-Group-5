import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationType } from '../enums';
import { User } from './user.entities';

@Entity({ name: 'notifications' })
@Index(['userId', 'isRead'])
@Index(['userId', 'sentAt'])
@Index(['entityType', 'entityId'])
@Index(['type'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (u) => u.notifications, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column('varchar', { length: 160 })
  title: string;

  @Column('text', { nullable: true })
  body: string | null;

  @Column('varchar', { name: 'entity_type', length: 40, nullable: true })
  entityType: string | null;

  @Column('uuid', { name: 'entity_id', nullable: true })
  entityId: string | null;

  @Column('jsonb', { nullable: true })
  data: Record<string, any> | null;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'sent_at',
    default: () => 'now()',
  })
  sentAt: Date;

  @Column('boolean', { name: 'is_read', default: false })
  isRead: boolean;

  @Column({ type: 'timestamptz', name: 'read_at', nullable: true })
  readAt: Date | null;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;
}
