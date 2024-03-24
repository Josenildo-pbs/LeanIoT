import { IsString, IsEmail, IsStrongPassword, IsOptional } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  is_admin: boolean;
}
