import { DataSource } from 'typeorm';
import { FinancialInsight } from '../entities/financial-insight.entities';
import { User } from '../entities/user.entities';

export async function seedFinancialInsights(
  dataSource: DataSource,
): Promise<void> {
  const insightRepo = dataSource.getRepository(FinancialInsight);
  const userRepo = dataSource.getRepository(User);

  // Get the admin user
  const adminUser = await userRepo.findOne({
    where: { email: 'admin@email.com' },
  });

  if (!adminUser) {
    console.log('⚠️  Financial Insights seed skipped - admin user not found');
    return;
  }

  // Clear existing insights for admin user
  await insightRepo.delete({ user_id: adminUser.id });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const insights = [
    {
      user_id: adminUser.id,
      insight_type: 'alert',
      title: 'Shopping Budget Near Limit',
      message:
        'You have spent 80% of your Shopping budget. Only $69.70 remaining.',
      period_start: monthStart,
      period_end: monthEnd,
      is_read: false,
    },
    {
      user_id: adminUser.id,
      insight_type: 'recommendation',
      title: 'Great Food Budget Management',
      message:
        'You are staying within your Food budget. Keep up the good work!',
      period_start: monthStart,
      period_end: monthEnd,
      is_read: false,
    },
    {
      user_id: adminUser.id,
      insight_type: 'alert',
      title: 'Upcoming Debt Payment',
      message: 'You have a debt payment of $500 due to John Doe in 15 days.',
      period_start: monthStart,
      period_end: monthEnd,
      is_read: false,
    },
    {
      user_id: adminUser.id,
      insight_type: 'warning',
      title: 'Overdue Debt',
      message:
        'You have an overdue debt of $150 to Mike Johnson. Please settle it soon.',
      period_start: monthStart,
      period_end: monthEnd,
      is_read: false,
    },
    {
      user_id: adminUser.id,
      insight_type: 'recommendation',
      title: 'Savings Opportunity',
      message:
        'Based on your spending patterns, you could save $200 monthly by reducing entertainment expenses.',
      period_start: monthStart,
      period_end: monthEnd,
      is_read: true,
    },
    {
      user_id: adminUser.id,
      insight_type: 'alert',
      title: 'Others Category Budget Exceeded',
      message:
        'You have exceeded your Others budget by $5. Consider reviewing miscellaneous expenses.',
      period_start: monthStart,
      period_end: monthEnd,
      is_read: false,
    },
    {
      user_id: adminUser.id,
      insight_type: 'recommendation',
      title: 'Debt Collection Reminder',
      message:
        'Emily Brown owes you $750. Consider sending a friendly reminder.',
      period_start: monthStart,
      period_end: monthEnd,
      is_read: false,
    },
  ];

  await insightRepo.save(insights);
  console.log('✅ Financial Insights seed data created successfully!');
}
