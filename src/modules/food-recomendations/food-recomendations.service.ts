import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFoodRecomendationDto } from './dtos/create-food-recomendations.dto';
import { UpdateFoodRecomendationDto } from './dtos/update-food-recomendations.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';
import { FoodRecomendations } from '@database/entities/food-recomendations/food-recomendation.entity';
@Injectable()
export class FoodRecomendationsService {
  private userRepository: Repository<User>;
  private foodRecomendationRepo: Repository<FoodRecomendations>;
  private userService: UsersService;
  constructor(private readonly datasource: DataSource) {
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
            message:
              'Este usuário não tem permissão suficiente para esta ação!',
            path: request.url,
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      const foodRecomendations =
        await this.foodRecomendationRepo.findAndCount();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'registo encontrado com sucesso!.',
        data: foodRecomendations,
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Não foi possível atender a esta requisição.',
          error: error.message,
          path: request.url,
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

      const data = this.foodRecomendationRepo.findOneBy({ id });

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
          message: 'Não foi possível atender a esta requisição.',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(
    request: Request,
    createFoodRecomendationDto: CreateFoodRecomendationDto,
  ) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      const foodRecomendationToSave = this.foodRecomendationRepo.create(
        createFoodRecomendationDto,
      );
      const foodRecomendationSaved = await this.foodRecomendationRepo.save(
        foodRecomendationToSave,
      );

      const {
        id,
        description,
        recomendationType,
        scientificJustification,
        createdAt,
      } = foodRecomendationSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Registo criado com sucesso!',
        data: {
          id,
          description,
          recomendationType,
          scientificJustification,
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
          message: `Não foi possível atender a esta requisição. Tente novamente mais tarde!`,
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
    updateFoodRecomendationDto: Partial<UpdateFoodRecomendationDto>,
  ) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      await this.foodRecomendationRepo.update(id, updateFoodRecomendationDto);

      const {
        description,
        recomendationType,
        scientificJustification,
        createdAt,
        updatedAt,
      } = await this.foodRecomendationRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'User updated sucessfully',
        data: {
          description,
          recomendationType,
          scientificJustification,
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

      const foodRecomendationToDelete =
        await this.foodRecomendationRepo.findOneBy({ id });

      if (!foodRecomendationToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Registo não encontrado!',
            path: request.url,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.foodRecomendationRepo.remove(foodRecomendationToDelete);

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
            'Não foi possível atender a essa requisição no momento. Tente novamente mais tarde!',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
