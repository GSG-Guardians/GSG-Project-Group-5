import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LogInDto } from './dto/request/login.request.dto';
import type { HashingProviderInterface } from './interfaces/hashing.provider.interface';
import type { TokenGeneratorInterface } from './interfaces/token-generator.interface';
import { Token } from './dto/response/token.response.dto';
import { UserService } from 'src/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('HashingProvider')
    private readonly hashingProvider: HashingProviderInterface,
    @Inject('TokenGenerator')
    private readonly tokenGenerator: TokenGeneratorInterface,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LogInDto): Promise<Token | undefined> {
    const { national_id, password } = loginDto;

    const user = await this.userService.findOneBynationalID(national_id);

    let correctPassword;

    if (!user) {
      throw new UnauthorizedException('Wrong national ID');
    }
    correctPassword = await this.hashingProvider.compare(
      password,
      user.password,
    );

    if (!correctPassword) {
      throw new UnauthorizedException('Wrong Password');
    }

    return await this.tokenGenerator.generateTokens(user);
  }
}
