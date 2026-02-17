export type TDashboardStatistics = {
    activeUsers: {
        count: number;
        changePercent: number;
    };
    totalUsers: {
        count: number;
        changePercent: number;
    };
    debts: {
        count: number;
        changePercent: number;
    };
}

export type TDashboardDount = {
    expenses: {
        count: number;
        percentage: number;
    };
    revenues: {
        count: number;
        percentage: number;
    };
    debts: {
        count: number;
        percentage: number;
    }
}

export type TMonthlyPoint = {
  month: string;     
  bills: number;
  expenses: number;
};

export type TUserManagementStatistics = {
    activeUsers: {
        count: number;
        changePercent: number;
      },
      totalUsers: {
        count: number;
        changePercent: number;
      },
      uActiveUsers: {
        count: number;
        changePercent: number;
      },
      newUsers: {
        count: number;
        changePercent: number;
      },
}