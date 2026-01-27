import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsNumber({}, { message: '*Avaliação deve ser um número!' })
  @IsNotEmpty({ message: '*Avaliação não poder estar vazio!' })
  rate: number;

  @IsString({ message: '*tipo não pode ser Inválida!' })
  @IsNotEmpty({ message: '*tipo não poder estar vazio!' })
  feedbackType: string;

  @IsString({ message: '*Comentário deve ser um texto!' })
  @IsNotEmpty({ message: '*Comentário não poder estar vazio!' })
  @MaxLength(200, { message: '*Comentário deve ter no máximo 200 caracteres!' })
  @MinLength(15, { message: '*Comentário deve ter no mínimo 15 caracteres!' })
  comment: string;
}
