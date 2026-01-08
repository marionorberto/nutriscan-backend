import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EnumRecomendationType } from '../interfaces/interfaces';

export class UpdateFoodRecomendationDto {
  @IsEnum(EnumRecomendationType, {
    message: '*recomendationType deve ser um valor válido',
  })
  @IsNotEmpty({ message: '*recomendationType não pode estar vazio' })
  @IsOptional()
  recomendationType: EnumRecomendationType;

  @IsString({ message: '*description deve ser um texto' })
  @IsNotEmpty({ message: '*description não pode estar vazio' })
  @IsOptional()
  description: string;

  @IsString({ message: '*scientificJustification deve ser um texto' })
  @IsNotEmpty({ message: '*scientificJustification não pode estar vazio' })
  @IsOptional()
  scientificJustification: string;
}
