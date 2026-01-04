import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { EnumImageType } from '../interfaces/interfaces';

export class CreateReferencedImageDto {
  @IsEnum(EnumImageType, { message: '*Extensão do ficheiro não suportado!' })
  @IsNotEmpty()
  imageType: EnumImageType;

  @IsString({ message: '*Nome da ficheiro precisa ser um texto.' })
  @IsNotEmpty({ message: '*Nome do ficheiro não poder estar vazio' })
  filename: string;

  @IsString({ message: '*Caminho da ficheiro precisa ser um texto.' })
  @IsNotEmpty({ message: '*Caminho do ficheiro não poder estar vazio' })
  filepath: string;
}
