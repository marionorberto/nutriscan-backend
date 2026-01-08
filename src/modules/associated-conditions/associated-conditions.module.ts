import { Module } from '@nestjs/common';
import { AssociatedConditionsService } from './associated-conditions.service';
import { AssociatedConditionsController } from './associated-conditions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssociatedConditions } from '../../database/entities/associated-conditions/associated-condition.entity';
import { UsersService } from '@modules/users/users.service';
import { EmailService } from 'shared/email/email.service';
@Module({
  imports: [TypeOrmModule.forFeature([AssociatedConditions])],
  controllers: [AssociatedConditionsController],
  providers: [AssociatedConditionsService, UsersService, EmailService],
  exports: [AssociatedConditionsService, UsersService, EmailService],
})
export class AssociatedConditionsModule {}
