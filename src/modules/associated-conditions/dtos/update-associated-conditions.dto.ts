import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateAssociatedConditionDto {
  @MaxLength(20, { message: '*decrição deve ter no máximo 20 caracteres!' })
  @MinLength(10, { message: '*decrição deve ter no mínimo 10 caracteres!' })
  @IsString({ message: '*descrição deve ser um texto!' })
  @IsNotEmpty({ message: '*decrição deve pode estar vazio!' })
  description: string;
}
