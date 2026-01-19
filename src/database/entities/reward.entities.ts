import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RewardStatus } from '../enums';
import { Asset } from './assets.entities';
import { UserReward } from './user-rewards.entities';

@Entity({ name: 'rewards' })
@Index(['status'])
@Index(['pointsCost'])
@Index(['iconAssetId'])
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 160 })
  title: string;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('int', { name: 'points_cost' })
  pointsCost: number;

  @Column('uuid', { name: 'icon_asset_id', nullable: true })
  iconAssetId: string | null;

  @ManyToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: 'icon_asset_id' })
  iconAsset?: Asset | null;

  @Column({ type: 'enum', enum: RewardStatus, default: RewardStatus.ACTIVE })
  status: RewardStatus;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @OneToMany(() => UserReward, (ur) => ur.reward)
  userRewards: UserReward[];
}
