import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/auth/auth.service';
import { TokenService } from 'src/token/token.service';
import { TokenModule } from 'src/token/token.module';
@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [UserController],
  providers: [ TokenService,UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
