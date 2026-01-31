import { DataSource } from 'typeorm';
import { FinancialInsight } from '../entities/financial-insight.entities';
import { BudgetCategory } from '../enums';

export async function seedFinancialInsights(
  dataSource: DataSource,
): Promise<void> {
  const insightRepo = dataSource.getRepository(FinancialInsight);

  // Clear existing insights
  await insightRepo.delete({});

  const now = new Date();

  const insights = [
    {
      user_id: 'temp-user-id',
      insight_type: 'ALERT',
      title: 'Budget Alert',
      message:
        'You have exceeded your Entertainment budget by $15.50 this month.',
      category: BudgetCategory.ENTERTAINMENT,
      period: 'monthly',
      is_read: false,
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      user_id: 'temp-user-id',
      insight_type: 'RECOMMENDATION',
      title: 'Savings Opportunity',
      message:
        'Based on your spending patterns, you could save $200 by reducing dining out.',
      category: BudgetCategory.FOOD,
      period: 'monthly',
      is_read: false,
      created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      user_id: 'temp-user-id',
      insight_type: 'ALERT',
      title: 'Upcoming Debt Payment',
      message: 'You have a debt payment of $500 due in 2 days to John Smith.',
      category: null,
      period: null,
      is_read: false,
      created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      user_id: 'temp-user-id',
      insight_type: 'RECOMMENDATION',
      title: 'Budget Optimization',
      message:
        'Consider increasing your Health budget. You have consistently spent more than allocated.',
      category: BudgetCategory.HEALTH,
      period: 'quarterly',
      is_read: true,
      created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      user_id: 'temp-user-id',
      insight_type: 'ALERT',
      title: 'Overdue Debt',
      message:
        'You have an overdue debt of $180 to Jessica Taylor. Please settle it soon.',
      category: null,
      period: null,
      is_read: false,
      created_at: now,
    },
    {
      user_id: 'temp-user-id',
      insight_type: 'RECOMMENDATION',
      title: 'Great Progress!',
      message:
        'You are within budget for Transport this month. Keep up the good work!',
      category: BudgetCategory.TRANSPORT,
      period: 'monthly',
      is_read: false,
      created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      user_id: 'temp-user-id',
      insight_type: 'ALERT',
      title: 'Others Category Near Limit',
      message:
        'You have spent 98% of your Others budget. Consider monitoring usage.',
      category: BudgetCategory.OTHERS,
      period: 'monthly',
      is_read: true,
      created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  await insightRepo.save(insights);
  console.log('✅ Financial Insights seed data created successfully!');
}
