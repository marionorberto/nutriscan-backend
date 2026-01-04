import { Module } from '@nestjs/common';
import { ReferencedImageService } from './reference-images.service';
import { ReferencedImageController } from './reference-images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferencedImages } from '../../database/entities/reference-images/reference-image.entity';
import { UsersService } from '@modules/users/users.service';
@Module({
  imports: [TypeOrmModule.forFeature([ReferencedImages])],
  controllers: [ReferencedImageController],
  providers: [ReferencedImageService, UsersService],
  exports: [ReferencedImageService, UsersService],
})
export class ReferenceImageModule {}
