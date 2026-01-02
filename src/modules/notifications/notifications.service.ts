import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationsDto } from './dtos/create-notifications.dto';
import { Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from '@database/entities/notifications/notification.entity';
import { UsersService } from '@modules/users/users.service';
import { EnumCategory, EnumNotificationCreator } from './interfaces/interfaces';
import { UpdateNotificationsDto } from './dtos/update-notifications.dto';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userServices: UsersService,
  ) {}

  async findNotificationCreatedByAdmin(request: Request) {
    try {
      const { idUser } = request['user'];

      const { data } = await this.userServices.findById(idUser);

      const isAdminUserAction = this.userServices.checkUserIsAdmin(data);

      if (!isAdminUserAction)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User do not have suficcient permission',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      const allUserNotifications =
        await this.notificationsRepository.findAndCount({
          relations: {
            user: true,
          },
          where: {
            createdBy: EnumNotificationCreator.admin,
          },
          order: {
            sendAt: 'DESC',
          },
        });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Notifications fetched sucessfully.',
        data: [{ count: allUserNotifications.length }, allUserNotifications],
        path: '/notifications/notification/:userId',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch notifications | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch notifications.',
          path: '/notifications/notification/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findNotificationCreatedBySystem(request: Request) {
    try {
      const { idUser } = request['user'];

      const { data } = await this.userServices.findById(idUser);

      const isAdminUserAction = this.userServices.checkUserIsAdmin(data);

      if (!isAdminUserAction)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User do not have suficcient permission',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      const allUserNotifications =
        await this.notificationsRepository.findAndCount({
          relations: {
            user: true,
          },
          where: {
            createdBy: EnumNotificationCreator.system,
          },
          order: {
            sendAt: 'DESC',
          },
        });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Notifications fetched sucessfully.',
        data: [{ count: allUserNotifications.length }, allUserNotifications],
        path: '/notifications/notification/:userId',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch notifications | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch notifications.',
          path: '/notifications/notification/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findUserNotificationByPk(id: string, request: Request) {
    try {
      const { idUser } = request['user'];

      this.userServices.checkUserIsAuthenticated(idUser);

      const notification = this.notificationsRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Notification fetched sucessfully.',
        data: notification,
        path: '/notifications/notification/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this notification. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this notification.',
          error: error.message,
          path: '/notifications/notification/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async createAdminNotifications(
    request: Request,
    createNotificationsDto: Partial<CreateNotificationsDto>,
  ) {
    try {
      const { idUser } = request['user'];

      this.userServices.checkUserIsAuthenticated(idUser);

      const { data } = await this.userServices.findById(idUser);

      const isAdminUserAction = this.userServices.checkUserIsAdmin(data);

      if (!isAdminUserAction)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User do not have suficcient permission',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      const notificationToSave = this.notificationsRepository.create(
        createNotificationsDto,
      );

      notificationToSave.createdBy = EnumNotificationCreator.admin;

      const {
        id,
        user,
        title,
        subtitle,
        content,
        category,
        emoji,
        urlAction,
        createdBy,
        status,
        sendAt,
      } = await this.notificationsRepository.save({
        ...notificationToSave,
        user: data,
      });
      return {
        statusCode: 201,
        method: 'POST',
        message: 'Notificação criada com sucesso.',
        data: {
          id,
          user,
          title,
          subtitle,
          content,
          category,
          emoji,
          urlAction,
          createdBy,
          status,
          sendAt,
        },
        path: 'notifications/create/notification',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Notification | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message:
            'Não foi possível criar nova notificação. Por favor tente novamente!',
          error: error.message,
          path: '/notifications',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createSystemNotification(createNotificationsDto: {
    title: string;
    subtitle?: string;
    content: string;
    emoji?: string;
    category: EnumCategory;
  }) {
    try {
      const notificationToSave = this.notificationsRepository.create(
        createNotificationsDto,
      );

      notificationToSave.createdBy = EnumNotificationCreator.admin;

      const {
        id,
        user,
        title,
        subtitle,
        content,
        category,
        emoji,
        urlAction,
        createdBy,
        status,
        sendAt,
      } = await this.notificationsRepository.save({
        ...notificationToSave,
      });
      return {
        statusCode: 201,
        method: 'POST',
        message: 'Notificação criada com sucesso.',
        data: {
          id,
          user,
          title,
          subtitle,
          content,
          category,
          emoji,
          urlAction,
          createdBy,
          status,
          sendAt,
        },
        path: 'notifications/create/notification',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Notification | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message:
            'Não foi possível criar nova notificação. Por favor tente novamente!',
          error: error.message,
          path: '/notifications',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOneByAdmin(
    idNotification: string,
    request: Request,
    updateNotificationsDto: Partial<UpdateNotificationsDto>,
  ) {
    try {
      const { idUser } = request['user'];

      this.userServices.checkUserIsAuthenticated(idUser);

      const { data } = await this.userServices.findById(idUser);

      const isAdminUserAction = this.userServices.checkUserIsAdmin(data);

      if (!isAdminUserAction)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User do not have suficcient permission',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      await this.notificationsRepository.update(
        idNotification,
        updateNotificationsDto,
      );

      const {
        id,
        title,
        subtitle,
        content,
        category,
        emoji,
        status,
        createdBy,
        urlAction,
        readAt,
        updatedAt,
      } = await this.notificationsRepository.findOneBy({ id: idNotification });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Notification updated sucessfully',
        data: {
          id,
          title,
          subtitle,
          content,
          category,
          emoji,
          status,
          createdBy,
          urlAction,
          readAt,
          updatedAt,
        },
        path: 'notification/update/notification/:idNotification',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new Notification | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Notification',
          error: error.message,
          path: 'update/notification/:idNotification',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOneByAdmin(idNotification: string, request: Request) {
    try {
      const { idUser } = request['user'];

      this.userServices.checkUserIsAuthenticated(idUser);

      const { data } = await this.userServices.findById(idUser);

      const isAdminUserAction = this.userServices.checkUserIsAdmin(data);

      if (!isAdminUserAction)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User do not have suficcient permission',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      const notificationToDelete = await this.notificationsRepository.findOneBy(
        {
          id: idNotification,
        },
      );

      if (!notificationToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Notifications Not Found',
            path: '/notifications/:idNotification',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.notificationsRepository.remove(notificationToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Notificação Apagada com sucesso!',
        path: 'notifications/delete/notification/' + idNotification,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message:
            'Não foi possível apagar a notificação. Tente novamente mais tarde!',
          error: error.message,
          path: 'notifications/delete/notification/' + idNotification,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
