import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDietaryRoutineDto } from './dtos/create-dietary-routines.dto';
import { UpdateDietaryRoutineDto } from './dtos/update-dietary-routines.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { DietaryRoutines } from '@database/entities/dietary-routines/dietary-routine.entity';
import { UsersService } from '@modules/users/users.service';
@Injectable()
export class DietaryRoutineService {
  private userRepository: Repository<User>;
  private dietaryRoutineRepo: Repository<DietaryRoutines>;
  private readonly userService: UsersService;
  constructor(private readonly datasource: DataSource) {
    this.userRepository = this.datasource.getRepository(User);
    this.dietaryRoutineRepo = this.datasource.getRepository(DietaryRoutines);
  }
  async findOne(request: Request) {
    try {
      const { idUser } = request['user'];

      const user = await this.userService.checkUserIsAuthenticated(idUser);

      if (user) {
        const data = this.dietaryRoutineRepo.findAndCount({
          where: {
            user,
          },
        });

        return {
          statusCode: 200,
          method: 'GET',
          message: 'Dados encontradas com sucesso!',
          data: data,
          path: '/dietary-routines/all',
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message:
            'Não foi possível atender a essa requisição no momento. Por favor tente novamente mais tarde!',
          error: error.message,
          path: '/dietary-routines/all',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(
    request: Request,
    createDietaryRoutineDto: CreateDietaryRoutineDto,
  ) {
    try {
      const { idUser } = request['user'];

      const user = await this.userService.checkUserIsAuthenticated(idUser);

      const diabeteProfileToSave = this.dietaryRoutineRepo.create({
        ...createDietaryRoutineDto,
      });

      const diabeteProfileSaved = await this.dietaryRoutineRepo.save({
        ...diabeteProfileToSave,
        user,
      });

      const {
        id,
        culturalPreferences,
        favoriteFoods,
        foodsToAvoid,
        mealSchedules,
        mealsPerDay,
        religiousRestrictions,
        createdAt,
      } = diabeteProfileSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'registo criado com sucesso!',
        data: {
          id,
          culturalPreferences,
          favoriteFoods,
          foodsToAvoid,
          mealSchedules,
          mealsPerDay,
          religiousRestrictions,
          createdAt,
        },
        path: '/dietary-routines/create/dietary-routine',
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: `Não foi possíve atender à essa requisição. Por favor tente novamente mais tarde!`,
          error: error.message,
          path: '/dietary-routines/create/dietary-routine',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    request: Request,
    updateDietaryRoutineDto: Partial<UpdateDietaryRoutineDto>,
  ) {
    try {
      const { idUser } = request['user'];

      await this.userService.checkUserIsAuthenticated(idUser);

      await this.dietaryRoutineRepo.update(id, updateDietaryRoutineDto);

      const {
        culturalPreferences,
        favoriteFoods,
        foodsToAvoid,
        mealSchedules,
        mealsPerDay,
        religiousRestrictions,
        createdAt,
        updatedAt,
      } = await this.dietaryRoutineRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Registo atualizado com sucesso!',
        data: {
          id,
          culturalPreferences,
          favoriteFoods,
          foodsToAvoid,
          mealSchedules,
          mealsPerDay,
          religiousRestrictions,
          createdAt,
          updatedAt,
        },
        path: '/dietary-routines/update/dietary-routine/' + id,
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
          path: '/dietary-routines/update/dietary-routine/' + id,
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

      const diabeteProfileToDelete = await this.dietaryRoutineRepo.findOneBy({
        id,
      });

      if (!diabeteProfileToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Nenhum registo encontrado.',
            path: '/dietary-routines/delete/dietary-routine/' + id,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.dietaryRoutineRepo.remove(diabeteProfileToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Registo apagado com sucesso!',
        path: '/dietary-routines/delete/dietary-routine/' + id,
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
          path: '/dietary-routines/delete/dietary-routine/' + id,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
