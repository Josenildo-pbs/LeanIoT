import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';


@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
   
    ) {}

  private excludePassword(user: User): User{
    return{
      ...user, 
        password: undefined
    }
  }
  async create(createUserDto: CreateUserDTO): Promise<User> {
    const { email, username, password } = createUserDto;
    const existEmail  = await this.prisma.user.findUnique({ where: { username } });
    if (existEmail) {
      throw new ConflictException(`Email already exist`);
    }
    const existUser = await this.prisma.user.findUnique({ where: { email } });
    if (existUser) {
      throw new ConflictException(`User already exist`);
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    return this.excludePassword(user)
  }

  async readOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { user_id:id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.excludePassword(user)
  }

  async readAll(): Promise<User[]> {

    const users  =  await  this.prisma.user.findMany();
    return  users.map(user=>this.excludePassword(user))
  }

  async update(id: number, updateUserDto: UpdateUserDTO): Promise<User> {
    const user = await this.readOne(id);
    const updatedUser =  await this.prisma.user.update({ where: { user_id: id }, data: updateUserDto });
    return this.excludePassword( updatedUser);
  }

  async updatePartial(id: number, updateUserDto: UpdateUserDTO): Promise<User> {
    const user = await this.readOne(id);
    const updatedUser =  await this.prisma.user.update({ where: { user_id: id }, data: updateUserDto });
    return  this.excludePassword(updatedUser)
  }

  async delete(id: number): Promise<User> {
    const user = await this.readOne(id);
    const deletedUser = this.prisma.user.delete({ where: { user_id:id } });
    return deletedUser;
  }

  async exist(id: number) {
    if ( !(await this.prisma.user.count({
        where: {
          user_id: id,
        },
      }))
    ) {
      throw new NotFoundException('The user does not exit');
    }
  }

}
