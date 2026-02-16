import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { AssetOwnerType } from '../enums';
import { User } from './user.entities';

@Entity({ name: 'assets' })
@Index(['userId'])
@Index(['ownerType', 'ownerId'])
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (u) => u.assets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // ✅ important
  user: User;

  @Column('text')
  url: string;

  @Column('varchar', { name: 'file_id', length: 255, nullable: true })
  fileId: string;

  @Column('varchar', { name: 'file_name', length: 255, nullable: true })
  fileName: string | null;

  @Column('varchar', { name: 'mime_type', length: 120, nullable: true })
  mimeType: string | null;

  @Column('bigint', { name: 'size_bytes', nullable: true })
  sizeBytes: string | null;

  @Column({
    type: 'enum',
    enum: AssetOwnerType,
    name: 'owner_type',
    nullable: true,
  })
  ownerType: AssetOwnerType;

  @Column('uuid', { name: 'owner_id', nullable: true })
  ownerId: string | null;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;
}
