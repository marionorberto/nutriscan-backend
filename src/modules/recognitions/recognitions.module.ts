import { Module } from '@nestjs/common';
import { RecognitionService } from './recognitions.service';
import { RecognitionController } from './recognitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recognitions } from '../../database/entities/recognitions/recognition.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Recognitions])],
  controllers: [RecognitionController],
  providers: [RecognitionService],
  exports: [RecognitionService],
})
export class RecognitionModule {}
