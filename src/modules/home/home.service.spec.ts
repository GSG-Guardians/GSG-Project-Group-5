import { NotFoundException } from '@nestjs/common';
import { Currency } from '../../../database/entities/currency.entities';
import { FinancialInsight } from '../../../database/entities/financial-insight.entities';
import { UserRole, UserStatus } from '../../../database/enums';
import { Asset } from '../../../database/entities/assets.entities';
import type { UserResponseDto } from '../user/dto';
import { ExpensesService } from '../expenses/expenses.service';
import { HomeService } from './home.service';

describe('HomeService', () => {
  let service: HomeService;
  let expensesService: { getOverview: jest.Mock };
  let currencyRepository: { findOne: jest.Mock };
  let financialInsightRepository: { find: jest.Mock };

  beforeEach(() => {
    expensesService = {
      getOverview: jest.fn(),
    };

    currencyRepository = {
      findOne: jest.fn(),
    };

    financialInsightRepository = {
      find: jest.fn(),
    };

    service = new HomeService(
      expensesService as unknown as ExpensesService,
      currencyRepository as any,
      financialInsightRepository as any,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns complete home payload and requests monthly expense overview', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-02-15T10:00:00.000Z'));

    const user = buildUser();
    const currency = buildCurrency();
    const insights = [
      buildInsight({
        id: 'insight-1',
        insight_type: 'alert',
        message: 'You have spent 80% of your Shopping budget.',
      }),
      buildInsight({
        id: 'insight-2',
        insight_type: 'warning',
        message: 'Overdue debt exists.',
      }),
      buildInsight({
        id: 'insight-3',
        insight_type: 'recommendation',
        message: 'Keep tracking your expenses.',
        is_read: true,
      }),
    ];

    currencyRepository.findOne.mockResolvedValue(currency);
    expensesService.getOverview.mockResolvedValue({
      totalBalance: '1200.00',
      totalIncome: '3500.00',
      totalExpenses: '456.78',
    });
    financialInsightRepository.find.mockResolvedValue(insights);

    const result = await service.getOverview(user);

    expect(result).toEqual({
      user: {
        id: user.id,
        fullName: user.fullName,
        avatarUrl: 'https://ik.imagekit.io/app/avatar.webp',
      },
      currency: {
        id: currency.id,
        code: currency.code,
        symbol: currency.symbol,
        name: currency.name,
      },
      balance: {
        current: '1200.00',
      },
      expenseDue: {
        amount: '456.78',
        periodLabel: 'current_month',
        startDate: '2026-02-01',
        endDate: '2026-02-28',
      },
      attentionNeeded: [
        {
          id: 'insight-1',
          type: 'alert',
          title: 'Budget Alert',
          message: 'You have spent 80% of your Shopping budget.',
          isRead: false,
          progressPercent: 80,
          createdAt: new Date('2026-02-10T08:00:00.000Z'),
        },
        {
          id: 'insight-2',
          type: 'warning',
          title: 'Budget Alert',
          message: 'Overdue debt exists.',
          isRead: false,
          progressPercent: 100,
          createdAt: new Date('2026-02-10T08:00:00.000Z'),
        },
        {
          id: 'insight-3',
          type: 'recommendation',
          title: 'Budget Alert',
          message: 'Keep tracking your expenses.',
          isRead: true,
          progressPercent: 65,
          createdAt: new Date('2026-02-10T08:00:00.000Z'),
        },
      ],
    });

    expect(expensesService.getOverview).toHaveBeenCalledWith(user, {
      period: 'month',
    });

    const findCall = financialInsightRepository.find.mock.calls[0][0];
    expect(findCall.take).toBe(3);
    expect(findCall.order).toEqual({ is_read: 'ASC', createdAt: 'DESC' });
    expect(findCall.where.user_id).toBe(user.id);
  });

  it('returns empty attentionNeeded when no insights are found', async () => {
    const user = buildUser();
    currencyRepository.findOne.mockResolvedValue(buildCurrency());
    expensesService.getOverview.mockResolvedValue({
      totalBalance: '500.00',
      totalIncome: '0.00',
      totalExpenses: '99.99',
    });
    financialInsightRepository.find.mockResolvedValue([]);

    const result = await service.getOverview(user);

    expect(result.attentionNeeded).toEqual([]);
  });

  it('throws NotFoundException when user has no default currency id', async () => {
    const user = buildUser({ defaultCurrencyId: '' as any });

    await expect(service.getOverview(user)).rejects.toThrow(NotFoundException);
    expect(currencyRepository.findOne).not.toHaveBeenCalled();
    expect(expensesService.getOverview).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when default currency cannot be found', async () => {
    const user = buildUser();
    currencyRepository.findOne.mockResolvedValue(null);

    await expect(service.getOverview(user)).rejects.toThrow(NotFoundException);
    expect(expensesService.getOverview).not.toHaveBeenCalled();
  });

  it('extracts and clamps percentage from insight message', async () => {
    const user = buildUser();
    currencyRepository.findOne.mockResolvedValue(buildCurrency());
    expensesService.getOverview.mockResolvedValue({
      totalBalance: '100.00',
      totalIncome: '0.00',
      totalExpenses: '0.00',
    });
    financialInsightRepository.find.mockResolvedValue([
      buildInsight({
        insight_type: 'alert',
        message: 'You have spent 120.5% of your budget.',
      }),
    ]);

    const result = await service.getOverview(user);

    expect(result.attentionNeeded[0].progressPercent).toBe(100);
  });

  it.each([
    ['warning', 100],
    ['alert', 85],
    ['recommendation', 65],
    ['info', 65],
    ['something_else', 50],
  ])(
    'uses fallback progressPercent for type "%s"',
    async (insightType, expectedPercent) => {
      const user = buildUser();
      currencyRepository.findOne.mockResolvedValue(buildCurrency());
      expensesService.getOverview.mockResolvedValue({
        totalBalance: '100.00',
        totalIncome: '0.00',
        totalExpenses: '0.00',
      });
      financialInsightRepository.find.mockResolvedValue([
        buildInsight({
          insight_type: insightType,
          message: 'No numeric percentage in this message.',
        }),
      ]);

      const result = await service.getOverview(user);

      expect(result.attentionNeeded[0].progressPercent).toBe(expectedPercent);
    },
  );
});

function buildUser(overrides: Partial<UserResponseDto> = {}): UserResponseDto {
  return {
    id: 'user-1',
    fullName: 'Ghydaa',
    email: 'ghydaa@example.com',
    phone: null,
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    defaultCurrencyId: 'currency-1',
    currentBalance: '1200.00',
    points: '0',
    avatarAssetId: 'asset-1',
    provider: 'LOCAL',
    providerId: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    avatar: [
      {
        id: 'asset-1',
        url: 'https://ik.imagekit.io/app/avatar.webp',
      } as Asset,
    ],
    ...overrides,
  };
}

function buildCurrency(overrides: Partial<Currency> = {}): Currency {
  return {
    id: 'currency-1',
    code: 'USD',
    symbol: '$',
    name: 'United States (US Dollar)',
    ...overrides,
  } as Currency;
}

function buildInsight(
  overrides: Partial<FinancialInsight> = {},
): FinancialInsight {
  return {
    id: 'insight-1',
    insight_type: 'alert',
    title: 'Budget Alert',
    message: 'Message',
    period_start: new Date('2026-02-01T00:00:00.000Z'),
    period_end: new Date('2026-02-28T00:00:00.000Z'),
    is_read: false,
    user: {} as any,
    user_id: 'user-1',
    createdAt: new Date('2026-02-10T08:00:00.000Z'),
    updatedAt: new Date('2026-02-10T08:00:00.000Z'),
    ...overrides,
  };
}
