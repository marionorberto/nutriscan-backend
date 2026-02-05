import { IsString, IsNotEmpty, IsOptional, IsBase64 } from 'class-validator';
import { Transform } from 'class-transformer';

export class AnalyzeImageDto {
  @Transform(({ value }) => {
    // Remover prefixo data URL se existir
    if (value && typeof value === 'string' && value.startsWith('data:image/')) {
      return value.split('base64,')[1];
    }
    return value;
  })
  @IsBase64()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsOptional()
  mimeType?: string;
}

export class FileUploadDto {
  @IsOptional()
  @IsString()
  occasion?: string;
}
