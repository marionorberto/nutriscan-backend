import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMedicationScheduleDto } from './dtos/create-medication-schedules.dto';
import { UpdateMedicationScheduleDto } from './dtos/update-medication-schedules.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';
import { MedicationSchedule } from '@database/entities/medication-schedules/medication-schedules.entity';
import { MedicationService } from '@modules/medications/medications.service';
@Injectable()
export class MedicationScheduleService {
  private userRepository: Repository<User>;
  private medicationScheduleRepo: Repository<MedicationSchedule>;
  private userService: UsersService;
  private medicationService: MedicationService;
  constructor(private readonly datasource: DataSource) {
    this.userRepository = this.datasource.getRepository(User);
    this.medicationScheduleRepo =
      this.datasource.getRepository(MedicationSchedule);
  }
  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const { data } = await this.userService.findById(idUser);

      const isAdminUserAction = this.userService.checkUserIsAdmin(data);

      if (!isAdminUserAction)
        throw new HttpException(
          {
            statusCode: 403,
            method: 'GET',
            message:
              'Usuário não tem suficiente permissão para proceder com a requisição!',
            path: request.url,
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      const medicationSchedules =
        await this.medicationScheduleRepo.findAndCount();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Registo encontrado com sucesso!',
        data: medicationSchedules,
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this medicationSchedules. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this medicationSchedule.',
          error: error.message,
          path: '/medicationSchedules/medicationSchedule/:id',
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

      const medicationSchedule = this.medicationScheduleRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'medicationSchedule fetched sucessfully.',
        data: medicationSchedule,
        path: '/medicationSchedules/medicationSchedule/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this medicationSchedule. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this medicationSchedule.',
          error: error.message,
          path: '/medicationSchedules/medicationSchedule/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(
    request: Request,
    createMedicationScheduleDto: CreateMedicationScheduleDto,
  ) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      const result = await this.medicationService.findOne(idUser);

      const medicationScheduleToSave = this.medicationScheduleRepo.create({
        ...createMedicationScheduleDto,
        medication: result,
      });
      const medicationScheduleSaved = await this.medicationScheduleRepo.save(
        medicationScheduleToSave,
      );

      const {
        id,
        medication,
        quantity,
        frequency,
        reminderEnabled,
        time,
        daysOfWeek,
        createdAt,
      } = medicationScheduleSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Registo criado com sucesso!',
        data: {
          id,
          frequency,
          medication,
          quantity,
          reminderEnabled,
          time,
          daysOfWeek,
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

  async updateOne(
    id: string,
    request: Request,
    updatemedicationScheduleDto: Partial<UpdateMedicationScheduleDto>,
  ) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      await this.medicationScheduleRepo.update(id, updatemedicationScheduleDto);

      const {
        frequency,
        medication,
        quantity,
        reminderEnabled,
        time,
        daysOfWeek,
        createdAt,
        updatedAt,
      } = await this.medicationScheduleRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Registo atualizado com sucesso!',
        data: {
          id,
          frequency,
          medication,
          quantity,
          reminderEnabled,
          time,
          daysOfWeek,
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
            'Não foi possível atender a essa requisição. Tente novamente mais tarde!',
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

      const medicationScheduleToDelete =
        await this.medicationScheduleRepo.findOneBy({ id });

      if (!medicationScheduleToDelete)
        throw new HttpException(
          {
            statusCode: 400,
            method: 'GET',
            message: 'Registo não encontrado!',
            path: request.url,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.medicationScheduleRepo.remove(medicationScheduleToDelete);

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
          message: 'Não foi possível atender a essa requisição!',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
