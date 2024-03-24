import {Injectable,UnauthorizedException} from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dtos/auth_register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Email or password is wrong');
    }
    const status = await bcrypt.compare(password, user.password);
    if (!status) {
      throw new UnauthorizedException('Email or password is wrong');
    }
    return this.tokenService.createToken(user);
  }
  // async forget(email: string) {
  //   const user = await this.prisma.users.findFirst({
  //     where: {
  //       email,
  //     },
  //   });
  //   if (!user) {
  //     throw new UnauthorizedException('Email does not exist');
  //   }
  //   const token = await this.jwtService.sign({
  //     id: user.id,
  //   });

  //   await this.mailer.sendMail({
  //     subject: 'Password recovery',
  //     to: 'josenildo@seuemail.com',
  //     template: 'forget',
  //     context: {
  //       name: user.name,
  //       token: token,
  //     },
  //   });
  //   return user;
  // }

  async reset(password: string, token: string) {
    const { id } = await this.checkToken(token);
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    const user = await this.prisma.user.update({
      where: {
        user_id: id,
      },
      data: {
        password,
      },
    });
    return this.tokenService.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.tokenService.createToken(user);
  }
}
