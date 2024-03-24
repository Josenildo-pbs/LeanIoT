import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenService } from 'src/token/token.service';
import { TokenModule } from 'src/token/token.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [AuthController],
  providers: [TokenService, AuthService, UserService],
})
export class AuthModule {}
