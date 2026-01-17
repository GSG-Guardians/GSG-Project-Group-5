import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { TokenGeneratorInterface } from '../interfaces/token-generator.interface';
import { Token } from '../dto/response/token.response.dto';
import { RolesEnum } from 'src/enums/roles.enum';
import { UserE } from 'src/entities/user.entity';

@Injectable()
export class TokenGenerator implements TokenGeneratorInterface {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtconfig: ConfigType<typeof jwtConfig>,
  ) {}

  async generateTokens(user: UserE): Promise<Token> {
    const [accessToken, refreshToken] = await Promise.all([
      await this.generateToken(user.id, this.jwtconfig.accessTokenTTL, {
        national_id: user.national_id,
        roles: user.roles,
      }),
      await this.generateToken(user.id, this.jwtconfig.refreshTokenTTL),
    ]);
    return { accessToken, refreshToken };
  }

  // async refreshToken(
  //   refreshToken: string,
  // ): Promise<Pick<Token, 'accessToken'>> {
  //   try {
  //     const { sub } = this.jwtService.verify(refreshToken);

  //     const user = await this.guardService.findOne(sub);
  //     if (!user) {
  //       throw new UnauthorizedException('user not found ');
  //     }
  //     const accessToken = await this.generateToken(
  //       sub,
  //       this.jwtconfig.accessTokenTTL,
  //       {
  //         national_id: user.national_id,
  //         role: RolesEnum.ADMIN,
  //       },
  //     );

  //     return { accessToken };
  //   } catch (error) {
  //     console.log(error);
  //     throw new UnauthorizedException('Invalid refresh token');
  //   }
  // }

  private async generateToken<T>(sub: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      { sub: sub, ...payload },
      { expiresIn: expiresIn },
    );
  }
}
