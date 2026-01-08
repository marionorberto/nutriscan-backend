import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMedicationDto } from './dtos/create-medications.dto';
import { UpdateMedicationDto } from './dtos/update-medications.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';
import { Medications } from '@database/entities/medications/medication.entity';
@Injectable()
export class MedicationService {
  private userRepository: Repository<User>;
  private medicationRepo: Repository<Medications>;
  private userService: UsersService;
  constructor(private readonly datasource: DataSource) {
    this.userRepository = this.datasource.getRepository(User);
    this.userRepository = this.datasource.getRepository(User);
  }
  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const { data } = await this.userService.findById(idUser);

      const isAdminUserAction = this.userService.checkUserIsAdmin(data);

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

      const feedbacks = await this.medicationRepo.findAndCount();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Feedbacks fetched sucessfully.',
        data: feedbacks,
        path: '/feedbacks/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this Feedbacks. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this feedback.',
          error: error.message,
          path: '/feedbacks/feedback/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByPk(id: string, request: Request) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      const feedback = this.medicationRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Feedback fetched sucessfully.',
        data: feedback,
        path: '/feedbacks/feedback/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this feedback. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this feedback.',
          error: error.message,
          path: '/feedbacks/feedback/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(request: Request, createFeedbackDto: CreateMedicationDto) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      const medicationToSave = this.medicationRepo.create(createFeedbackDto);
      const medicationSaved = await this.medicationRepo.save(medicationToSave);

      const {
        id,
        name,
        form,
        dosage,
        schedules,
        instructions,
        startDate,
        endDate,
        isActive,
        createdAt,
      } = medicationSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Registo criado com sucesso!',
        data: {
          id,
          name,
          form,
          dosage,
          schedules,
          instructions,
          startDate,
          endDate,
          isActive,
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
          message: `Não foi possível atender a essa requisição. Tente novamente mais tarde!`,
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    request: Request,
    updateMedicationDto: Partial<UpdateMedicationDto>,
  ) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      await this.medicationRepo.update(id, updateMedicationDto);

      const {
        name,
        form,
        dosage,
        schedules,
        instructions,
        startDate,
        endDate,
        isActive,
        createdAt,
        updatedAt,
      } = await this.medicationRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Registo atualizado com sucesso!',
        data: {
          id,
          name,
          form,
          dosage,
          schedules,
          instructions,
          startDate,
          endDate,
          isActive,
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
            'Não foi possível atender a esta requisição. Tente novamente mais tarde!',
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

      const feedbackToDelete = await this.medicationRepo.findOneBy({ id });

      if (!feedbackToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Feedback Not Found',
            path: '/feedbacks/feedback/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.medicationRepo.remove(feedbackToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Registo apagado com sucesso!',
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message:
            'Não foi possível atender a essa requisição. Tente novamente mais tarde!',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const result = this.medicationRepo.findOneBy({ id });

      if (!result)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'medication Not Found',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return result;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message:
            'Não foi possível atender a essa requisição. Tente novamente mais tarde!',
          error: error.message,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
