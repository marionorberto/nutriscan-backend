import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateProfilesDto {
  @IsNotEmpty({ message: 'data de nascimento não pode estar vazia' })
  @IsOptional()
  birthday: Date;

  @IsNotEmpty({ message: '*Endereço não pode estar vazio.' })
  @IsOptional()
  address: string;

  @IsString({ message: '*Telefone deve ser um texto!' })
  @MaxLength(9, { message: '*Telefone deve ter no máximo 9 caracteres!' })
  @MinLength(9, { message: 'O Telefone deve ter no mínimo 9 caracteres!' })
  @IsNotEmpty({ message: 'O Telefone não deve pode estar vazio!' })
  @IsOptional()
  phone: string;

  @MaxLength(1, { message: 'O Gênero deve ter no máximo 1 caracteres!' })
  @MinLength(1, { message: 'O Gênero deve ter no mínimo 1 caracteres!' })
  @IsString({ message: '*Gênero deve ser texto!' })
  @IsNotEmpty({ message: 'O Gênero deve pode estar vazio!' })
  gender: string;

  @MinLength(10, {
    message: 'O *imagem nome deve ter no mínimo 10 caracteres!',
  })
  @IsNotEmpty({ message: '*Imagem não pode estar vazia!' })
  img: string;

  @IsNotEmpty({ message: '*userID não pode estar vazia!' })
  userID: string;
}
