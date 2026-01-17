import { Token } from '../dto/response/token.response.dto';
import { UserE } from 'src/entities/user.entity';

export interface TokenGeneratorInterface {
  generateTokens(user: UserE): Promise<Token>;
  // refreshToken(refreshToken: string): Promise<Pick<Token, 'accessToken'>>;
}
