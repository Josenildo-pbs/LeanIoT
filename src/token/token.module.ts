import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1 day' },
      }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
