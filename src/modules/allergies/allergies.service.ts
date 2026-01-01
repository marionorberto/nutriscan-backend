import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAllergyDto } from './dtos/create-allergies.dto';
import { UpdateAllergyDto } from './dtos/update-allergies.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { Allergies } from '@database/entities/allergies/allergy.entity';
import { UsersService } from '@modules/users/users.service';
@Injectable()
export class AllergiesService {
  private userRepo: Repository<User>;
  private allergyRepo: Repository<Allergies>;
  constructor(
    private readonly datasource: DataSource,
    private readonly userService: UsersService,
  ) {
    this.userRepo = this.datasource.getRepository(User);
    this.allergyRepo = this.datasource.getRepository(Allergies);
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
            method: 'DELETE',
            message: 'User do not have suficcient permission',
            path: '/allergies/delete/:id',
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      const allergies = this.allergyRepo.findAndCount();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Allergies fetched sucessfully.',
        data: allergies,
        path: '/allergies/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(error);
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

      const allergy = this.allergyRepo.findOneBy({ id });

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

  async create(request: Request, createAllergyDto: CreateAllergyDto) {
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

      const allergyToSave = this.allergyRepo.create(createAllergyDto);
      const allergySaved = await this.allergyRepo.save(allergyToSave);

      const { id, description, note, createdAt } = allergySaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'User created sucessfully',
        data: {
          id,
          description,
          note,
          createdAt,
        },
        path: '/allergies/create/allergy',
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
          message: `Falha ao cadastrar nova *Allergia, ${error.message}`,
          error: error.message,
          path: '/allergies/create/allergy',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    request: Request,
    updateAllergiesDto: Partial<UpdateAllergyDto>,
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

      await this.allergyRepo.update(id, updateAllergiesDto);

      const { description, note, createdAt, updatedAt } =
        await this.allergyRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Allergies updated sucessfully',
        data: {
          id,
          description,
          note,
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

      const allergyToDelete = await this.allergyRepo.findOneBy({ id });
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

      await this.allergyRepo.remove(allergyToDelete);

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
}
