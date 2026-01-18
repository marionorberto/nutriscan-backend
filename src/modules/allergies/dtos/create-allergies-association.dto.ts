import { IsNotEmpty } from 'class-validator';

export class CreateAllergyAssociationDto {
  @IsNotEmpty({ message: '*user não pode estar vazio!' })
  userID: string;

  @IsNotEmpty({ message: '*condições associadas não pode estar vazio!' })
  allergies: string[];
}
