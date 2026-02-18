export type HomeAttentionNeededItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  progressPercent: number;
  createdAt: Date;
};

export type HomeOverviewResponseDto = {
  user: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  currency: {
    id: string;
    code: string;
    symbol: string | null;
    name: string;
  };
  balance: {
    current: string;
  };
  expenseDue: {
    amount: string;
    periodLabel: 'current_month';
    startDate: string;
    endDate: string;
  };
  attentionNeeded: HomeAttentionNeededItem[];
};

