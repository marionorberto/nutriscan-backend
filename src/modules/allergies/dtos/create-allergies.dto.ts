import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateAllergyDto {
  @MaxLength(20, { message: '*decrição deve ter no máximo 20 caracteres!' })
  @MinLength(3, { message: '*decrição deve ter no mínimo 10 caracteres!' })
  @IsString({ message: '*descrição deve ser um texto!' })
  @IsNotEmpty({ message: '*decrição não deve estar vazio!' })
  description: string;

  @MaxLength(200, { message: '*nota deve ter no máximo 200 caracteres!' })
  @MinLength(15, { message: '*nota deve ter no mínimo 15 caracteres!' })
  @IsString({ message: '*nota deve ser um texto!' })
  @IsOptional()
  note?: string;
}
