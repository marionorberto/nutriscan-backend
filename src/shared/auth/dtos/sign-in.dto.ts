import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Email Inválido' })
  @IsString({ message: 'O email deve ser uma string!' })
  @IsNotEmpty({ message: 'O Email não poder estar vazio!' })
  email: string;

  @MinLength(8, { message: 'Password Inválida' })
  @IsString({ message: 'A Password deve ser uma string!' })
  @IsNotEmpty({ message: 'A Password não pode estar nula!' })
  password: string;
}
