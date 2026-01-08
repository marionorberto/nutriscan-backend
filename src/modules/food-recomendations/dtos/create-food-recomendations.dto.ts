import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnumRecomendationType } from '../interfaces/interfaces';

export class CreateFoodRecomendationDto {
  @IsEnum(EnumRecomendationType, {
    message: '*recomendationType deve ser um valor válido',
  })
  @IsNotEmpty({ message: '*recomendationType não pode estar vazio' })
  recomendationType: EnumRecomendationType;

  @IsString({ message: '*description deve ser um texto' })
  @IsNotEmpty({ message: '*description não pode estar vazio' })
  description: string;

  @IsString({ message: '*scientificJustification deve ser um texto' })
  @IsNotEmpty({ message: '*scientificJustification não pode estar vazio' })
  scientificJustification: string;
}
