import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PushToken } from 'database/entities/push-token.entities';
import admin from 'firebase-admin';
import { Repository } from 'typeorm';

type PushMessage = {
  tokens: string[];
  notification: {
    title: string;
    body: string;
  };
  data: Record<string, string>;
};

type PushResponse = {
  responses: Array<{
    success: boolean;
    error?: { code?: string };
  }>;
  successCount: number;
  failureCount: number;
};

type FirebaseAdminLike = {
  apps: unknown[];
  app: () => unknown;
  initializeApp: (options: { credential: unknown }) => unknown;
  credential: {
    cert: (serviceAccount: {
      projectId: string;
      clientEmail: string;
      privateKey: string;
    }) => unknown;
  };
  messaging: (app?: unknown) => {
    sendEachForMulticast: (message: PushMessage) => Promise<PushResponse>;
  };
};

type SendPushInput = {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
};

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);
  private readonly firebaseAdmin: FirebaseAdminLike;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PushToken)
    private readonly pushTokenRepository: Repository<PushToken>,
  ) {
    this.firebaseAdmin = admin as unknown as FirebaseAdminLike;
  }

  async registerToken(
    userId: string,
    token: string,
    platform: string,
  ): Promise<void> {
    const normalizedToken = token.trim();
    const normalizedPlatform = platform.trim().toLowerCase();
    const now = new Date();

    const existing = await this.pushTokenRepository.findOne({
      where: { token: normalizedToken },
    });

    if (existing) {
      existing.userId = userId;
      existing.platform = normalizedPlatform;
      existing.isActive = true;
      existing.lastSeenAt = now;
      await this.pushTokenRepository.save(existing);
      return;
    }

    const row = this.pushTokenRepository.create({
      userId,
      token: normalizedToken,
      platform: normalizedPlatform,
      isActive: true,
      lastSeenAt: now,
    });
    await this.pushTokenRepository.save(row);
  }

  async removeToken(userId: string, token: string): Promise<void> {
    await this.pushTokenRepository.update(
      { userId, token: token.trim(), isActive: true },
      { isActive: false },
    );
  }

  async sendToUser(input: SendPushInput): Promise<void> {
    const tokens = await this.pushTokenRepository.find({
      where: { userId: input.userId, isActive: true },
      select: ['id', 'token'],
    });

    if (tokens.length === 0) {
      return;
    }

    const message: PushMessage = {
      tokens: tokens.map((t) => t.token),
      notification: {
        title: input.title,
        body: input.body,
      },
      data: this.toStringMap(input.data ?? null),
    };

    const response = await this.getMessaging().sendEachForMulticast(message);

    const invalidTokens: string[] = [];
    response.responses.forEach((entry, index) => {
      if (!entry.success && this.isInvalidTokenError(entry.error?.code)) {
        const token = tokens[index]?.token;
        if (token) invalidTokens.push(token);
      }
    });

    if (invalidTokens.length > 0) {
      await this.pushTokenRepository
        .createQueryBuilder()
        .update(PushToken)
        .set({ isActive: false })
        .where('token IN (:...tokens)', { tokens: invalidTokens })
        .execute();
    }

    this.logger.log(
      `Push sent to user ${input.userId}: ${response.successCount} success, ${response.failureCount} failed`,
    );
  }

  private getFirebaseApp(): unknown {
    if (this.firebaseAdmin.apps.length > 0) {
      return this.firebaseAdmin.app();
    }

    const projectId = this.configService.getOrThrow<string>(
      'FIREBASE_PROJECT_ID',
    );
    const clientEmail = this.configService.getOrThrow<string>(
      'FIREBASE_CLIENT_EMAIL',
    );
    const privateKey = this.configService
      .getOrThrow<string>('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n');

    return this.firebaseAdmin.initializeApp({
      credential: this.firebaseAdmin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  private getMessaging() {
    return this.firebaseAdmin.messaging(this.getFirebaseApp());
  }

  private toStringMap(
    data: Record<string, unknown> | null,
  ): Record<string, string> {
    if (!data) return {};
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, String(value)]),
    );
  }

  private isInvalidTokenError(code?: string): boolean {
    return (
      code === 'messaging/registration-token-not-registered' ||
      code === 'messaging/invalid-registration-token'
    );
  }
}
