import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDiabeteProfileDto } from './dtos/create-diabete-profiles.dto';
import { UpdateDiabeteProfileDto } from './dtos/update-diabete-profiles.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';
import { DiabeteProfiles } from '@database/entities/diabeti-profiles/diabeti_profile.entity';
@Injectable()
export class DiabeteProfilesService {
  private userRepo: Repository<User>;
  private diabeteProfileRepo: Repository<DiabeteProfiles>;
  private readonly userService: UsersService;
  constructor(private readonly datasource: DataSource) {
    this.userRepo = this.datasource.getRepository(User);
    this.diabeteProfileRepo = this.datasource.getRepository(DiabeteProfiles);
  }
  async findOne(request: Request) {
    try {
      const { idUser } = request['user'];

      const user = await this.userService.checkUserIsAuthenticated(idUser);

      if (user) {
        const data = this.diabeteProfileRepo.findAndCount({
          where: {
            user,
          },
        });

        return {
          statusCode: 200,
          method: 'GET',
          message: 'Dados de perfil clínico encontradas com sucesso!',
          data: data,
          path: '/diabete-profiles/all',
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message:
            'Não foi possível encontrar os dados das suas dados de perfil clínico. Por favor tente novamente mais tarde!',
          error: error.message,
          path: '/app-diabete-profiles/all',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(
    request: Request,
    creatediabeteProfileDto: CreateDiabeteProfileDto,
  ) {
    try {
      const { idUser } = request['user'];

      const user = await this.userService.checkUserIsAuthenticated(idUser);

      const diabeteProfileToSave = this.diabeteProfileRepo.create({
        ...creatediabeteProfileDto,
      });

      const diabeteProfileSaved = await this.diabeteProfileRepo.save({
        ...diabeteProfileToSave,
        user,
      });

      const { id, currentStatus, diabetiType, diagnosisYear, createdAt } =
        diabeteProfileSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Dados Clínicos criadas com sucesso!',
        data: {
          id,
          currentStatus,
          diabetiType,
          diagnosisYear,
          createdAt,
        },
        path: '/diabete-profiles/create/diabete-profile',
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: `Não foi possíve atender à essa requisição. Por favor tente novamente mais tarde!`,
          error: error.message,
          path: '/diabete-profiles/create/diabete-profile',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    request: Request,
    updateDiabeteProfileDto: Partial<UpdateDiabeteProfileDto>,
  ) {
    try {
      const { idUser } = request['user'];

      await this.userService.checkUserIsAuthenticated(idUser);

      await this.diabeteProfileRepo.update(id, updateDiabeteProfileDto);

      const {
        currentStatus,
        diabetiType,
        diagnosisYear,
        hyperGlycemiaFrequency,
        hypoGlycemiaFrequency,
        lastFastingGlucose,
        lastHba1c,
        createdAt,
        updatedAt,
      } = await this.diabeteProfileRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Dados Clínicos atualizadas com sucesso!',
        data: {
          id,
          currentStatus,
          diabetiType,
          diagnosisYear,
          hyperGlycemiaFrequency,
          hypoGlycemiaFrequency,
          lastFastingGlucose,
          lastHba1c,
          createdAt,
          updatedAt,
        },
        path: '/diabete-profiles/update/diabete-profile/' + id,
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
          path: '/diabete-profiles/update/diabete-profile/' + id,
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

      const diabeteProfileToDelete = await this.diabeteProfileRepo.findOneBy({
        id,
      });

      if (!diabeteProfileToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Nenhum registo encontrado.',
            path: '/diabete-profiles/delete/diabete-profile/' + id,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.diabeteProfileRepo.remove(diabeteProfileToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Registo apagado com sucesso!',
        path: '/diabete-profiles/delete/diabete-profile/' + id,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message:
            'Não foi possível atender essa requisição. Tente novamente mais tarde!',
          error: error.message,
          path: '/diabete-profiles/delete/diabete-profile/' + id,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
