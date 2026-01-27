import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppSettingsDto } from './dtos/create-app-settings.dto';
import { UpdateAppSettingsDto } from './dtos/update-app-settings.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';
import { AppSettings } from '@database/entities/app-settings/app-setting.entity';
import { EnumTheme } from './interfaces/interfaces';
@Injectable()
export class AppSettingsService {
  private userRepository: Repository<User>;
  private appSettingRepo: Repository<AppSettings>;
  constructor(
    private readonly datasource: DataSource,
    private readonly userService: UsersService,
  ) {
    this.userRepository = this.datasource.getRepository(User);
    this.appSettingRepo = this.datasource.getRepository(AppSettings);
  }

  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const user = await this.userService.checkUserIsAuthenticated(idUser);

      if (user) {
        const data = this.appSettingRepo.findAndCount({
          where: {
            user,
          },
        });

        return {
          statusCode: 200,
          method: 'GET',
          message: 'Configurações encontradas com sucesso!',
          data: data,
          path: '/settings/all',
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message:
            'Não foi possível encontrar os dados das suas definições. Por favor tente novamente mais tarde!',
          error: error.message,
          path: '/app-settings/settings/',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByPk(request: Request) {
    try {
      const { userId } = request['user'];

      const data = await this.appSettingRepo.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });

      console.log('my settings', data);

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Registo encontrado com sucesso!',
        data: data,
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message:
            'Não foi possível atender a essa requisição no momento. Por favor tente novamente mais tarde!',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(request: Request, createAppSettingDTO: CreateAppSettingsDto) {
    try {
      const { userId } = request['user'];

      const user = await this.userService.checkUserIsAuthenticated(userId);

      const appSettingToSave = this.appSettingRepo.create({
        ...createAppSettingDTO,
        theme: EnumTheme[createAppSettingDTO.theme],
      });

      const appSettingSaved = await this.appSettingRepo.save({
        ...appSettingToSave,
        user,
      });

      const {
        id,
        enableNutricionalAlert,
        notificationEnabled,
        saveImageHistory,
        shareDataForTraining,
        theme,
        createdAt,
      } = appSettingSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Configurações criadas com sucesso!',
        data: {
          id,
          enableNutricionalAlert,
          notificationEnabled,
          saveImageHistory,
          shareDataForTraining,
          theme,
          createdAt,
        },
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: `Não foi possíve atender à essa requisição. Por favor tente novamente mais tarde!`,
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    request: Request,
    updateAppSettingsDto: Partial<UpdateAppSettingsDto>,
  ) {
    try {
      const { userId } = request['user'];

      await this.userService.checkUserIsAuthenticated(userId);

      await this.appSettingRepo.update(
        updateAppSettingsDto.id,
        updateAppSettingsDto,
      );

      const {
        notificationEnabled,
        saveImageHistory,
        enableNutricionalAlert,
        shareDataForTraining,
        theme,
        createdAt,
        updatedAt,
      } = await this.appSettingRepo.findOneBy({ id: updateAppSettingsDto.id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Configurações atualizadas com sucesso!',
        data: {
          id: updateAppSettingsDto.id,
          notificationEnabled,
          saveImageHistory,
          enableNutricionalAlert,
          shareDataForTraining,
          theme,
          createdAt,
          updatedAt,
        },
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message:
            'Não foi possível atualizar dados, tente novamente mais tarde!',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string, request: Request) {
    try {
      const { idUser } = request['user'];

      await this.userService.checkUserIsAuthenticated(idUser);

      const settingToDelete = await this.appSettingRepo.findOneBy({ id });

      if (!settingToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Nenhuma dados de configuração encotrada.',
            path: '/app-settings/setting/' + id,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.appSettingRepo.remove(settingToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Suas configurações foram apagadas com sucesso!',
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Configurações foram apagadas com sucesso!',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
