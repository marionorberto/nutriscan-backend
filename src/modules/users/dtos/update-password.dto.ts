import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Atual password não pode ser Inválida!' })
  @MaxLength(30, {
    message: 'Atual Password deve ter no máximo 30 caracteres!',
  })
  @MinLength(8, { message: 'Atual Password deve ter no mínimo 8 caracteres!' })
  @IsNotEmpty({ message: 'Atual Password não poder estar vazio!' })
  atualPassword: string;

  @IsString({ message: 'Nova Password não pode ser Inválida!' })
  @MaxLength(30, { message: 'NovaPassword deve ter no máximo 30 caracteres!' })
  @MinLength(8, { message: 'Nova Password deve ter no mínimo 8 caracteres!' })
  @IsNotEmpty({ message: 'Nova Password não poder estar vazio!' })
  newPassword: string;
}
