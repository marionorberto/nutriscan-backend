import {
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateUsersDto {
  @MaxLength(30, {
    message: 'O *primeiro nome deve ter no máximo 30 caracteres!',
  })
  @MinLength(3, {
    message: 'O *primeiro nome deve ter no mínimo 3 caracteres!',
  })
  @IsString({ message: '*primeiro nome deve ser texto' })
  @IsOptional()
  firstname: string;

  @MaxLength(30, { message: 'O último nome deve ter no máximo 30 caracteres!' })
  @MinLength(3, { message: 'O último nome deve ter no mínimo 3 caracteres!' })
  @IsString({ message: '*último nome deve ser texto' })
  @IsOptional()
  lastname: string;

  @MaxLength(70, { message: 'O Username deve ter no máximo 70 caracteres!' })
  @MinLength(3, { message: 'O Username deve ter no mínimo 10 caracteres!' })
  @IsString({ message: '*username deve ser texto' })
  @IsOptional()
  username: string;

  @IsEmail({}, { message: 'Por favor introduza um Email válido!' })
  @IsString({ message: 'O Email deve ser uma string!' })
  @MaxLength(60, { message: 'O Email deve ter no máximo 60 caracteres!' })
  @MinLength(12, { message: 'O Email deve ter no mínimo 12 caracteres!' })
  @IsNotEmpty({ message: 'O Email não pode estar vazio!' })
  @IsOptional()
  email: string;

  @IsString({ message: 'A Password não pode ser Inválida!' })
  @IsNotEmpty({ message: 'A Password não poder estar vazio!' })
  @MaxLength(30, { message: 'A Password deve ter no máximo 30 caracteres!' })
  @MinLength(8, { message: 'A Password deve ter no mínimo 8 caracteres!' })
  @IsOptional()
  password: string;
}
