import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    try {
      const data = this.tokenService.checkToken(
        (authorization ?? '').split(' ')[1],
      );
      request.tokenPayload = data;
      return true;
    } catch (error) {
      return false;
    }
  }
}
