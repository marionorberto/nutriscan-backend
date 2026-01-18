import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssociatedConditionDto } from './dtos/create-associated-.conditions.dto';
import { UpdateAssociatedConditionDto } from './dtos/update-associated-conditions.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { AssociatedConditions } from '@database/entities/associated-conditions/associated-condition.entity';
import { UsersService } from '@modules/users/users.service';
@Injectable()
export class AssociatedConditionsService {
  private userRepo: Repository<User>;
  private associatedConditionRepo: Repository<AssociatedConditions>;
  constructor(
    private readonly datasource: DataSource,
    private readonly userService: UsersService,
  ) {
    this.userRepo = this.datasource.getRepository(User);
    this.associatedConditionRepo =
      this.datasource.getRepository(AssociatedConditions);
  }

  async findAll() {
    try {
      const associatedConditions =
        await this.associatedConditionRepo.findAndCount();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Requisição atendida com sucesso!',
        data: associatedConditions,
        path: '/associated-conditions/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message:
            'Não foi possível atender a essa requisição. Tente novamente mais tarde',
          error: error.message,
          path: '/associated-conditions/all',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByPk(id: string, request: Request) {
    try {
      const { idUser } = request['user'];

      const { data } = await this.userService.findById(idUser);

      const isAdminUserAction = this.userService.checkUserIsAdmin(data);

      if (!isAdminUserAction)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'DELETE',
            message: 'User do not have suficcient permission',
            path: '/allergies/delete/:id',
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      const user = await this.userRepo.findOneBy({ id: idUser });

      if (!user)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this user.',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      const allergy = this.associatedConditionRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Allergy fetched sucessfully.',
        data: allergy,
        path: '/allergies/allergy/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this allergy. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this allergy.',
          error: error.message,
          path: '/allergies/allergy/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createAssociatedConditionDto: CreateAssociatedConditionDto) {
    try {
      const associatedConditionToSave = this.associatedConditionRepo.create(
        createAssociatedConditionDto,
      );
      const allergySaved = await this.associatedConditionRepo.save(
        associatedConditionToSave,
      );

      const { id, description, createdAt } = allergySaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Condição associada criada com sucesso',
        data: {
          id,
          description,
          createdAt,
        },
        path: '/ac/create/ac',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed  to create a new Allergy | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: `Falha ao cadastrar nova *ac, ${error.message}`,
          error: error.message,
          path: '/ac/create/ac',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    request: Request,
    updateAllergiesDto: Partial<UpdateAssociatedConditionDto>,
  ) {
    try {
      const { idUser } = request['user'];

      const { data } = await this.userService.findById(idUser);

      const isAdminUserAction = this.userService.checkUserIsAdmin(data);

      if (!isAdminUserAction)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'DELETE',
            message: 'User do not have suficcient permission',
            path: '/allergies/delete/:id',
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      await this.associatedConditionRepo.update(id, updateAllergiesDto);

      const { description, createdAt, updatedAt } =
        await this.associatedConditionRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Allergies updated sucessfully',
        data: {
          id,
          description,
          createdAt,
          updatedAt,
        },
        path: '/allergies/update/allergy/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new Allergy | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Não foi possível atualizar dados da entidade *Allergy!',
          error: error.message,
          path: '/allergies/update/allergy/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string, request: Request) {
    try {
      const { idUser } = request['user'];

      const { data } = await this.userService.findById(idUser);

      const isAdminUserAction = this.userService.checkUserIsAdmin(data);

      if (!isAdminUserAction)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'DELETE',
            message: 'User do not have suficcient permission',
            path: '/allergies/delete/:id',
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      const allergyToDelete = await this.associatedConditionRepo.findOneBy({
        id,
      });
      if (!allergyToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Allergy Not Found',
            path: '/allergies/allergy/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.associatedConditionRepo.remove(allergyToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Allergy deleted sucessfully',
        path: '/allergies/delete/allergy/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete User | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete Allergy',
          error: error.message,
          path: '/allergies/delete/allergy/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findUserInfo(id: string) {
    try {
      const data = await this.userRepo.findOne({
        where: {
          id,
        },
        relations: {
          associatedCondition: true,
        },
      });

      if (!data || !data.associatedCondition) return [];
      return data.associatedCondition; // Não precisa de forEach para clonar
    } catch (error) {
      throw new HttpException(
        {
          message:
            'Não foi possível encontrar os dados das suas dados de perfil clínico. Por favor tente novamente mais tarde!',
          error: error.message,
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
