import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { EnumFeedbackType } from '../interfaces/interfaces';

export class UpdateFeedbackDto {
  @IsNumber({}, { message: '*Avaliação deve ser um número!' })
  @IsNotEmpty({ message: '*Avaliação não poder estar vazio!' })
  @IsOptional()
  rate: number;

  @IsEnum({ message: '*tipo fora do padrão requerido.' })
  @IsString({ message: '*tipo não pode ser Inválida!' })
  @IsNotEmpty({ message: '*tipo não poder estar vazio!' })
  @IsOptional()
  feedbackType: EnumFeedbackType;

  @IsString({ message: '*Comentário deve ser um texto!' })
  @IsNotEmpty({ message: '*Comentário não poder estar vazio!' })
  @MaxLength(200, { message: '*Comentário deve ter no máximo 200 caracteres!' })
  @MinLength(15, { message: '*Comentário deve ter no mínimo 15 caracteres!' })
  @IsOptional()
  comment: string;
}
