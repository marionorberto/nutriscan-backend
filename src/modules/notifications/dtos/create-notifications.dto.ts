import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateNotificationsDto {
  @MaxLength(100, { message: '*Título deve ter no máximo 100 caracteres.' })
  @MinLength(10, { message: '*Título deve ter no mínimo 10 caracteres.' })
  @IsString({ message: '*Título deve ser um texto.' })
  @IsNotEmpty({ message: '*Título não pode estar vazio' })
  title: string;

  @MaxLength(100, { message: '*Subtítulo deve ter no máximo 100 caracteres.' })
  @MinLength(10, { message: '*Subtítulo deve ter no mínimo 10 caracteres.' })
  @IsString({ message: '*Subtítulo deve ser um texto.' })
  @IsNotEmpty({ message: '*Subtítulo não pode estar vazio.' })
  @IsOptional()
  subtitle?: string;

  @MaxLength(200, { message: '*Conteúdo deve ter no máximo 200 caracteres.' })
  @MinLength(10, { message: '*Conteúdo deve ter no mínimo 200 caracteres.' })
  @IsString({ message: '*Conteúdo deve ser um texto.' })
  @IsNotEmpty()
  content: string;

  @IsString({ message: '*Emoji deve ser um texto.' })
  @IsNotEmpty({ message: '*Emoji não pode estar vazio.' })
  emoji?: string;

  @IsString({ message: '*Categoria deve ser um texto.' })
  @IsNotEmpty({ message: '*Categoria não pode estar vazia.' })
  category: string;

  @IsNotEmpty({ message: '*Categoria não pode estar vazia.' })
  readAt: string;

  @IsNotEmpty({ message: '*Categoria não pode estar vazia.' })
  status: string;

  @IsOptional()
  urlAction?: string;
}
