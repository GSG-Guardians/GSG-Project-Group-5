import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { UnifiedResponseInterceptor } from '../../interceptors/unifiedResponse.interceptor';
import type { HomeOverviewResponseDto } from './dto/response.dto';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

describe('HomeController', () => {
  let app: INestApplication<App>;
  const mockUser = { id: 'user-1', fullName: 'Ghydaa' } as any;
  const homeServiceMock = {
    getOverview: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: homeServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use((req, _res, next) => {
      req.user = mockUser;
      next();
    });
    app.useGlobalInterceptors(new UnifiedResponseInterceptor());
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('GET /home/overview returns 200 with success=true and data contract', async () => {
    const payload: HomeOverviewResponseDto = {
      user: {
        id: 'user-1',
        fullName: 'Ghydaa',
        avatarUrl: 'https://ik.imagekit.io/app/avatar.webp',
      },
      currency: {
        id: 'currency-1',
        code: 'USD',
        symbol: '$',
        name: 'United States (US Dollar)',
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
          title: 'Shopping Budget Near Limit',
          message: 'You have spent 80% of your Shopping budget.',
          isRead: false,
          progressPercent: 80,
          createdAt: new Date('2026-02-10T08:00:00.000Z'),
        },
      ],
    };
    homeServiceMock.getOverview.mockResolvedValue(payload);

    const response = await request(app.getHttpServer())
      .get('/home/overview')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.id).toBe(payload.user.id);
    expect(response.body.data.currency.code).toBe(payload.currency.code);
    expect(response.body.data.expenseDue.amount).toBe(payload.expenseDue.amount);
    expect(response.body.data.attentionNeeded).toHaveLength(1);
    expect(homeServiceMock.getOverview).toHaveBeenCalledWith(mockUser);
  });
});

