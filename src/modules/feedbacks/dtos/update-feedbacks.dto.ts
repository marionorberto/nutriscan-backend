import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateFeedbackDto {
  @IsNumber({}, { message: '*Avaliação deve ser um número!' })
  @IsNotEmpty({ message: '*Avaliação não poder estar vazio!' })
  @IsOptional()
  rate: number;

  @IsString({ message: '*tipo não pode ser Inválida!' })
  @IsNotEmpty({ message: '*tipo não poder estar vazio!' })
  @IsOptional()
  feedbackType: string;

  @MaxLength(200, { message: '*Comentário deve ter no máximo 200 caracteres!' })
  @MinLength(15, { message: '*Comentário deve ter no mínimo 15 caracteres!' })
  @IsString({ message: '*Comentário deve ser um texto!' })
  @IsNotEmpty({ message: '*Comentário não poder estar vazio!' })
  @IsOptional()
  comment: string;

  @IsNotEmpty({ message: '*id não poder estar vazio!' })
  id: string;
}
