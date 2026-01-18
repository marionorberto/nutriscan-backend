import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfilesDto } from './dtos/create-profiles.dto';
import { UpdateProfilesDto } from './dtos/update-profiles.dto';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';
import { EmailService } from 'shared/email/email.service';
import { Profiles } from '@database/entities/profile/profile.entity';
@Injectable()
export class ProfilesService {
  private profileRepo: Repository<Profiles>;
  constructor(
    private readonly datasource: DataSource,
    private readonly emailService: EmailService,
  ) {
    this.profileRepo = this.datasource.getRepository(Profiles);
  }

  async findAll() {
    try {
      const users = await this.profileRepo.find({
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'all users fetched sucessfully.',
        data: [
          {
            count: users.length,
            users,
          },
        ],
        path: '/users/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch users | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch users.',
          path: '/users/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(request: Request) {
    try {
      const { idUser } = request['user'];

      const user = await this.profileRepo.findOneBy({ id: idUser });

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

      return {
        statusCode: 200,
        method: 'GET',
        message: 'User fetched sucessfully.',
        data: user,
        path: '/users/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this user. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this user.',
          error: error.message,
          path: '/users/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findById(id: string) {
    try {
      const user = await this.profileRepo.findOneBy({ id });

      if (!user)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'no user found.',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'User fetched sucessfully.',
        data: user,
        path: '/users/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this user. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this user.',
          error: error.message,
          path: '/users/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(CreateProfilesDto: CreateProfilesDto) {
    try {
      const userToSave = this.profileRepo.create(CreateProfilesDto);

      const userSaved = await this.profileRepo.save({
        ...userToSave,
        user: {
          id: CreateProfilesDto.userID,
        },
      });

      const { id, address, birthday, gender, phone, createdAt } = userSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'User created sucessfully',
        data: {
          id,
          address,
          birthday,
          gender,
          phone,
          createdAt,
        },
        path: '/users/create/user',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed  to create a new User | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: `Falhou ao cadastrar usuário, ${error.message}`,
          error: error.message,
          path: '/users/create/user',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    request: Request,
    UpdateProfilesDto: Partial<UpdateProfilesDto>,
  ) {
    try {
      const { idUser: id } = request['user'];

      await this.profileRepo.update(id, UpdateProfilesDto);

      const { address, birthday, phone, gender, createdAt, updatedAt } =
        await this.profileRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'User updated sucessfully',
        data: {
          id,
          address,
          birthday,
          phone,
          gender,
          createdAt,
          updatedAt,
        },
        path: '/users/update/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new User | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Não foi possível atualizar dados do usuário!',
          error: error.message,
          path: '/users/update/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const userToDelete = await this.profileRepo.findOneBy({ id });
      if (!userToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Not Found',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.profileRepo.remove(userToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'User deleted sucessfully',
        path: '/users/delete/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete User | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete User',
          error: error.message,
          path: '/users/delete/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
