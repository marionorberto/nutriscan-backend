import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateProfilesAdminDto {
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
  @IsOptional()
  gender: string;

  @MinLength(10, {
    message: 'O *imagem nome deve ter no mínimo 10 caracteres!',
  })
  @IsNotEmpty({ message: '*Imagem não pode estar vazia!' })
  @IsOptional()
  img: string;

  @MaxLength(25, { message: '*Trabalho deve ter no máximo 9 caracteres!' })
  @MinLength(5, { message: '*Trabalho deve ter no mínimo 9 caracteres!' })
  @IsNotEmpty({ message: '*Trabalho não deve pode estar vazio!' })
  @IsOptional()
  job: string;

  @MaxLength(200, { message: '*Biografia deve ter no máximo 200 caracteres!' })
  @MinLength(10, { message: '*Biografia deve ter no mínimo 10 caracteres!' })
  @IsNotEmpty({ message: '*Biografia não deve pode estar vazio!' })
  @IsOptional()
  bio: string;

  @MaxLength(200, { message: '*Linkedin deve ter no máximo 200 caracteres!' })
  @MinLength(10, { message: '*Linkedin deve ter no mínimo 10 caracteres!' })
  @IsNotEmpty({ message: '*Linkedin não deve pode estar vazio!' })
  @IsOptional()
  linkedinUrl: string;

  @MaxLength(200, { message: '*Facebook deve ter no máximo 200 caracteres!' })
  @MinLength(10, { message: '*Facebook deve ter no mínimo 10 caracteres!' })
  @IsNotEmpty({ message: '*Facebook não deve pode estar vazio!' })
  @IsOptional()
  facebookUrl: string;

  @MaxLength(200, { message: '*Biografia deve ter no máximo 200 caracteres!' })
  @MinLength(10, { message: '*Biografia deve ter no mínimo 10 caracteres!' })
  @IsNotEmpty({ message: '*Biografia não deve pode estar vazio!' })
  @IsOptional()
  bi: string;

  @MaxLength(200, {
    message: '*Código Postal deve ter no máximo 200 caracteres!',
  })
  @MinLength(10, {
    message: '*Código Postal deve ter no mínimo 10 caracteres!',
  })
  @IsNotEmpty({ message: '*Código Postal não deve pode estar vazio!' })
  @IsOptional()
  postalCode: string;

  @IsNotEmpty({ message: '*userID não pode estar vazia!' })
  userID: string;
}
