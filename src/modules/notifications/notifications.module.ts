import { Module } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { notificationController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from '@database/entities/notifications/notification.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Notifications])],
  controllers: [notificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
