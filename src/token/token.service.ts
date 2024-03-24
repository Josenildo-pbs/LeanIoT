import { Injectable,  BadRequestException} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
      ) {}
   createToken(user: User) {
        return {
          accessToken: this.jwtService.sign({
            id: user.user_id,
            username: user.username,
            email: user.email,
            is_admin: user.is_admin,
          }),
        };
      }
      checkToken(token: string) {
        try {
          const data = this.jwtService.verify(token);
          return data;
        } catch (e) {
          throw new BadRequestException(e);
        }
      }
      isValidToken(token: string) {
        try {
          this.checkToken(token);
          return true;
        } catch (e) {
          return false;
        }
      }
}



