import { DataSource } from 'typeorm';
import { Budget } from '../entities/budget.entities';
import { User } from '../entities/user.entities';
import { BudgetCategory } from '../enums';

export async function seedBudgets(dataSource: DataSource): Promise<void> {
  const budgetRepo = dataSource.getRepository(Budget);
  const userRepo = dataSource.getRepository(User);

  // Get the admin user to associate budgets
  const adminUser = await userRepo.findOne({
    where: { email: 'admin@email.com' },
  });

  if (!adminUser) {
    console.log('âڑ ï¸ڈ  Budget seed skipped - admin user not found');
    return;
  }

  // Clear existing budgets for admin user
  await budgetRepo.delete({ user_id: adminUser.id });

  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const budgets = [
    // Current month budgets
    {
      user_id: adminUser.id,
      category: BudgetCategory.FOOD,
      allocated_amount: 500,
      spent_amount: 320.5,
      start_date: currentMonth,
      end_date: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      notes: 'Monthly grocery and dining budget',
      is_active: true,
    },
    {
      user_id: adminUser.id,
      category: BudgetCategory.TRANSPORT,
      allocated_amount: 300,
      spent_amount: 180.75,
      start_date: currentMonth,
      end_date: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      notes: 'Gas and public transportation',
      is_active: true,
    },
    {
      user_id: adminUser.id,
      category: BudgetCategory.ENTERTAINMENT,
      allocated_amount: 200,
      spent_amount: 150.0,
      start_date: currentMonth,
      end_date: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      notes: 'Movies, streaming, events',
      is_active: true,
    },
    {
      user_id: adminUser.id,
      category: BudgetCategory.HEALTH,
      allocated_amount: 400,
      spent_amount: 120.0,
      start_date: currentMonth,
      end_date: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      notes: 'Medical expenses and insurance',
      is_active: true,
    },
    {
      user_id: adminUser.id,
      category: BudgetCategory.SHOPPING,
      allocated_amount: 350,
      spent_amount: 280.3,
      start_date: currentMonth,
      end_date: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      notes: 'Clothing and personal items',
      is_active: true,
    },
    {
      user_id: adminUser.id,
      category: BudgetCategory.OTHERS,
      allocated_amount: 250,
      spent_amount: 245.0,
      start_date: currentMonth,
      end_date: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      notes: 'Utilities and miscellaneous',
      is_active: true,
    },

    // Next month budgets
    {
      user_id: adminUser.id,
      category: BudgetCategory.FOOD,
      allocated_amount: 550,
      spent_amount: 0,
      start_date: nextMonth,
      end_date: new Date(now.getFullYear(), now.getMonth() + 2, 0),
      notes: 'Planning for next month',
      is_active: true,
    },
    {
      user_id: adminUser.id,
      category: BudgetCategory.TRANSPORT,
      allocated_amount: 320,
      spent_amount: 0,
      start_date: nextMonth,
      end_date: new Date(now.getFullYear(), now.getMonth() + 2, 0),
      notes: 'Next month transportation',
      is_active: true,
    },

    // Last month budgets (completed)
    {
      user_id: adminUser.id,
      category: BudgetCategory.FOOD,
      allocated_amount: 480,
      spent_amount: 465.8,
      start_date: lastMonth,
      end_date: new Date(now.getFullYear(), now.getMonth(), 0),
      notes: 'Last month food budget',
      is_active: false,
    },
    {
      user_id: adminUser.id,
      category: BudgetCategory.ENTERTAINMENT,
      allocated_amount: 180,
      spent_amount: 195.5,
      start_date: lastMonth,
      end_date: new Date(now.getFullYear(), now.getMonth(), 0),
      notes: 'Exceeded budget slightly',
      is_active: false,
    },
  ];

  await budgetRepo.save(budgets);
  console.log('âœ… Budget seed data created successfully!');
}
