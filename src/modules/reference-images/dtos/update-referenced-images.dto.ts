import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { EnumImageType } from '../interfaces/interfaces';

export class UpdateReferencedImageDto {
  @IsEnum(EnumImageType, { message: '*Extensão do ficheiro não suportado!' })
  @IsNotEmpty()
  @IsOptional()
  imageType: EnumImageType;

  @IsString({ message: '*Nome da ficheiro precisa ser um texto.' })
  @IsNotEmpty({ message: '*Nome do ficheiro não poder estar vazio' })
  @IsOptional()
  filename: string;

  @IsString({ message: '*Caminho da ficheiro precisa ser um texto.' })
  @IsNotEmpty({ message: '*Caminho do ficheiro não poder estar vazio' })
  @IsOptional()
  filepath: string;
}
