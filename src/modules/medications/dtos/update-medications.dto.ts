import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationDto } from './create-medications.dto';

export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {}
