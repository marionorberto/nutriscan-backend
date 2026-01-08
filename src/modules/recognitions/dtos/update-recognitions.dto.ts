import { PartialType } from '@nestjs/mapped-types';
import { CreateRecognitionDto } from './create-recognitions.dto';

export class UpdateRecognitionDto extends PartialType(CreateRecognitionDto) {}
