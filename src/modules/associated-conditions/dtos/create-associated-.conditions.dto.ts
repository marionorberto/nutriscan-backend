import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateAssociatedConditionDto {
  @MaxLength(30, { message: '*decrição deve ter no máximo 20 caracteres!' })
  @MinLength(5, { message: '*decrição deve ter no mínimo 5 caracteres!' })
  @IsString({ message: '*descrição deve ser um texto!' })
  @IsNotEmpty({ message: '*decrição deve pode estar vazio!' })
  description: string;
}
