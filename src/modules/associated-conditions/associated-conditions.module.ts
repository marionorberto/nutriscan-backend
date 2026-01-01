import { Module } from '@nestjs/common';
import { AssociatedConditionsService } from './associated-conditions.service';
import { AssociatedConditionsController } from './associated-conditions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssociatedConditions } from '../../database/entities/associated-conditions/associated-condition.entity';
@Module({
  imports: [TypeOrmModule.forFeature([AssociatedConditions])],
  controllers: [AssociatedConditionsController],
  providers: [AssociatedConditionsService],
  exports: [AssociatedConditionsService],
})
export class AssociatedConditionsModule {}
