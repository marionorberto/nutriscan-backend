import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dtos/create-goals.dto';
import { UpdateGoalDto } from './dtos/update-goals.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { Goals } from '@database/entities/goals/goal.entity';
import { UsersService } from '@modules/users/users.service';
@Injectable()
export class GoalsService {
  private userRepository: Repository<User>;
  private readonly userService: UsersService;
  private goalRepo: Repository<Goals>;
  constructor(private readonly datasource: DataSource) {
    this.userRepository = this.datasource.getRepository(User);
    this.goalRepo = this.datasource.getRepository(Goals);
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

      const goals = await this.goalRepo.findAndCount();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'goals fetched sucessfully.',
        data: goals,
        path: '/goals/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this goals. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this goal.',
          error: error.message,
          path: '/goals/goal/:id',
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

      const goal = this.goalRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'goal fetched sucessfully.',
        data: goal,
        path: '/goals/goal/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this goal. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this goal.',
          error: error.message,
          path: '/goals/goal/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(request: Request, createGoalDto: CreateGoalDto) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      const goalToSave = this.goalRepo.create(createGoalDto);
      const goalsaved = await this.goalRepo.save(goalToSave);

      const {
        id,
        nutricionalGoal,
        targetFastingGlucose,
        targetWeight,
        createdAt,
      } = goalsaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Registo criado com sucesso!',
        data: {
          id,
          nutricionalGoal,
          targetFastingGlucose,
          targetWeight,
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
    updateGoalDto: Partial<UpdateGoalDto>,
  ) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      await this.goalRepo.update(id, updateGoalDto);

      const {
        nutricionalGoal,
        targetFastingGlucose,
        targetWeight,
        createdAt,
        updatedAt,
      } = await this.goalRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Registo atualizado com sucesso!',
        data: {
          id,
          nutricionalGoal,
          targetFastingGlucose,
          targetWeight,
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
            'Não foi possível atualizar registo. Tente novamente mais tarde!',
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

      const goalToDelete = await this.goalRepo.findOneBy({ id });

      if (!goalToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'goal Not Found',
            path: '/goals/goal/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.goalRepo.remove(goalToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Registo apagado com sucesso',
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Não foi possível apagar esse registo',
          error: error.message,
          path: request.originalUrl,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
