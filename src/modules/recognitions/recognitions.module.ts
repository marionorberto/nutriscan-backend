import { Module } from '@nestjs/common';
import { RecognitionService } from './recognitions.service';
import { RecognitionController } from './recognitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recognitions } from '../../database/entities/recognitions/recognition.entity';
import { UsersService } from '@modules/users/users.service';
import { EmailService } from 'shared/email/email.service';
@Module({
  imports: [TypeOrmModule.forFeature([Recognitions])],
  controllers: [RecognitionController],
  providers: [RecognitionService, UsersService, EmailService],
  exports: [RecognitionService, UsersService, EmailService],
})
export class RecognitionModule {}
