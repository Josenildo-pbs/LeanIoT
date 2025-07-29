import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1 day' },
      }),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
