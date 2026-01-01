import { Module } from '@nestjs/common';
import { AssociatedConditionsService } from './associated-conditions.service';
import { AssociatedConditionsController } from './associated-conditions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssociatedConditions } from '../../database/entities/associated-conditions/associated-condition.entity';
import { UsersService } from '@modules/users/users.service';
@Module({
  imports: [TypeOrmModule.forFeature([AssociatedConditions])],
  controllers: [AssociatedConditionsController],
  providers: [AssociatedConditionsService, UsersService],
  exports: [AssociatedConditionsService, UsersService],
})
export class AssociatedConditionsModule {}
