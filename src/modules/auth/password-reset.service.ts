import {
  BadRequestException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from 'database/entities/user.entities';
import { PasswordResetCode } from 'database/entities/password-reset-code.entities';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class PasswordResetService {
  private readonly CODE_TTL_MIN = 10;
  private readonly MAX_ATTEMPTS = 5;

  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(PasswordResetCode)
    private readonly resetRepo: Repository<PasswordResetCode>,
    private readonly mail: MailService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  private generate4DigitCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private expiresAt() {
    return new Date(Date.now() + this.CODE_TTL_MIN * 60 * 1000);
  }

  async requestReset(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) return { success: true };

    await this.resetRepo.update(
      { userId: user.id, usedAt: IsNull(), expiresAt: MoreThan(new Date()) },
      { usedAt: new Date() },
    );

    const code = this.generate4DigitCode();
    const codeHash = await argon2.hash(code);

    await this.resetRepo.save({
      userId: user.id,
      codeHash,
      expiresAt: this.expiresAt(),
      usedAt: null,
      attemptCount: 0,
    });

    await this.mail.sendPasswordResetCode(user.email, code);

    return { success: true };
  }

  async verifyResetCode(email: string, code: string) {
    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) throw new BadRequestException('Invalid code');

    const row = await this.resetRepo.findOne({
      where: { userId: user.id, usedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    if (!row) throw new BadRequestException('Invalid code');
    if (row.expiresAt.getTime() < Date.now())
      throw new BadRequestException('Code expired');

    if (row.attemptCount >= this.MAX_ATTEMPTS) {
      throw new HttpException(
        'Too many attempts, request a new code',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const ok = await argon2.verify(row.codeHash, code);

    if (!ok) {
      row.attemptCount += 1;
      await this.resetRepo.save(row);
      throw new BadRequestException('Invalid code');
    }

    row.usedAt = new Date();
    await this.resetRepo.save(row);
    const userForToken = this.authService.mapUserToToken(user);
    const resetToken = this.authService.generateToken(userForToken);
    return { success: true, token: resetToken };
  }

  async confirmReset(userId: string, newPassword: string) {
    const passwordHash = await argon2.hash(newPassword);

    const updated = await this.usersRepo.update(
      { id: userId },
      { passwordHash },
    );
    if (updated.affected == 0) {
      throw new BadRequestException('User not found');
    }

    await this.resetRepo.update(
      { userId, usedAt: IsNull(), expiresAt: MoreThan(new Date()) },
      { usedAt: new Date() },
    );
    return { success: true };
  }
}
