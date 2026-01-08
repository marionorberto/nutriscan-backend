import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecognitionDto {
  @IsNumber({}, { message: '*modeAccurancy deve ser um número' })
  @Type(() => Number)
  @IsNotEmpty({ message: '*modeAccurancy não pode estar vazio' })
  modeAccurancy: number;

  @IsString({ message: '*imagePath deve ser um texto' })
  @IsNotEmpty({ message: '*imagePath não pode estar vazio' })
  imagePath: string;

  @IsOptional()
  @IsArray({ message: '*foodItemIds deve ser uma lista' })
  @ArrayNotEmpty({ message: '*foodItemIds não pode estar vazio' })
  @IsUUID('4', {
    each: true,
    message: '*foodItemIds deve conter apenas UUIDs válidos',
  })
  foodItemIds?: string[];
}
