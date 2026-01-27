import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { CreateNotificationsDto } from './dtos/create-notifications.dto';
import { Request } from 'express';
import { EnumCategory } from './interfaces/interfaces';
import { UpdateNotificationsDto } from './dtos/update-notifications.dto';
import { AuthGuard } from 'shared/auth/auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsServices: NotificationService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  async findAll(@Req() request: Request) {
    return await this.notificationsServices.findAll(request);
  }

  @UseGuards(AuthGuard)
  @Get('all-admin-notifications')
  async findNotificationCreatedByAdmin(@Req() request: Request) {
    return await this.notificationsServices.findNotificationCreatedByAdmin(
      request,
    );
  }

  @Get('all-system-notifications')
  async findNotificationCreatedBySystem(@Req() request: Request) {
    return await this.notificationsServices.findNotificationCreatedBySystem(
      request,
    );
  }

  @Get('notification/:idNotification')
  async findUserNotificationByPk(
    @Param('idNotification') idNotification: string,
    @Req() request: Request,
  ) {
    return await this.notificationsServices.findUserNotificationByPk(
      idNotification,
      request,
    );
  }

  @Post('create/admin-notification')
  createAdminNotifications(
    @Req() request: Request,
    @Body() createNotificationsDto: CreateNotificationsDto,
  ) {
    return this.notificationsServices.createAdminNotifications(
      request,
      createNotificationsDto,
    );
  }

  @Post('create/notification')
  create(createNotificationsDto: {
    title: string;
    subtitle?: string;
    content: string;
    emoji?: string;
    category: EnumCategory;
  }) {
    return this.notificationsServices.createSystemNotification(
      createNotificationsDto,
    );
  }

  @Put('update/notification/:idNotification')
  async updateOneByAdmin(
    @Param('idNotification') idNotification: string,
    @Req() request: Request,
    @Body() updateNotificationsDto: Partial<UpdateNotificationsDto>,
  ) {
    return await this.notificationsServices.updateOneByAdmin(
      idNotification,
      request,
      updateNotificationsDto,
    );
  }

  @Delete('delete/notification/:idNotification')
  async deleteOneByAdmin(
    @Param('idNotification') idNotification: string,
    @Req() request: Request,
  ) {
    return await this.notificationsServices.deleteOneByAdmin(
      idNotification,
      request,
    );
  }
}
