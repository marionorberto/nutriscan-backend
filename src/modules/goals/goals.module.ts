import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '@modules/users/users.service';
import { Goals } from '@database/entities/goals/goal.entity';
import { EmailService } from 'shared/email/email.service';
@Module({
  imports: [TypeOrmModule.forFeature([Goals])],
  controllers: [GoalsController],
  providers: [GoalsService, UsersService, EmailService],
  exports: [GoalsService, UsersService, EmailService],
})
export class GoalModule {}
