import { Module } from '@nestjs/common';
import { ReferenceImageService } from './reference-images.service';
import { ReferenceImageController } from './reference-images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferenceImages } from '../../database/entities/reference-images/reference-image.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ReferenceImages])],
  controllers: [ReferenceImageController],
  providers: [ReferenceImageService],
  exports: [ReferenceImageService],
})
export class ReferenceImageModule {}
