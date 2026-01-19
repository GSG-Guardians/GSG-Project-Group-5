import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entities';
import { Reward } from './reward.entities';

@Entity({ name: 'user_rewards' })
@Index(['userId', 'rewardId'], { unique: true })
@Index(['userId', 'claimedAt'])
@Index(['rewardId'])
export class UserReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (u) => u.rewards, { onDelete: 'CASCADE' })
  user: User;

  @Column('uuid', { name: 'reward_id' })
  rewardId: string;

  @ManyToOne(() => Reward, (r) => r.userRewards, { onDelete: 'CASCADE' })
  reward: Reward;

  @Column('int', { name: 'points_spent' })
  pointsSpent: number;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'claimed_at',
    default: () => 'now()',
  })
  claimedAt: Date;
}
