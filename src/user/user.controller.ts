import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserService } from './user.service';
import { IsAdmin } from 'src/decorators/isAdmin.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { IsAdminGuard } from 'src/guards/isAdmin.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @UseGuards(AuthGuard, IsAdminGuard)
  @IsAdmin(true)
  @Get()
  async list() {
    return this.userService.readAll();
  }
  @UseGuards(AuthGuard, IsAdminGuard)
  @IsAdmin(true)
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    this.userService.exist(id);
    return this.userService.readOne(id);
  }
  @UseGuards(AuthGuard, IsAdminGuard)
  @IsAdmin(true)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateUserDTO,
  ) {
    this.userService.exist(id);
    return this.userService.update(id, data);
  }
  @UseGuards(AuthGuard, IsAdminGuard)
  @IsAdmin(true)
  @Patch(':id')
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDTO,
  ) {
    this.userService.exist(id);
    return this.userService.updatePartial(id, data);
  }
  @UseGuards(AuthGuard, IsAdminGuard)
  @IsAdmin(true)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    this.userService.exist(id);
    return this.userService.delete(id);
  }
}
