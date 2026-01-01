import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dtos/create-physical-activity-level.dto';
import { UpdateUsersDto } from './dtos/update-physical-activity-level.dto';
import * as bcryptjs from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
@Injectable()
export class FoodRecomendationsService {
  private userRepository: Repository<User>;
  constructor(private readonly datasource: DataSource) {
    this.userRepository = this.datasource.getRepository(User);
  }

  async findAll() {
    try {
      return {
        statusCode: 200,
        method: 'GET',
        message: 'Users fetched sucessfully.',
        data: [],
        path: '/users/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findByPk(request: Request) {
    try {
      const { idUser } = request['user'];

      const user = await this.userRepository.findOneBy({ id: idUser });

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

  async create(createUsersDto: CreateUsersDto) {
    try {
      const userToSave = this.userRepository.create(createUsersDto);
      const userSaved = await this.userRepository.save(userToSave);

      const { id, username, email, createdAt } = userSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'User created sucessfully',
        data: {
          id,
          username,
          email,
          password: createUsersDto.password,
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

  async updateOne(request: Request, updateUsersDto: Partial<UpdateUsersDto>) {
    try {
      const { idUser: id } = request['user'];

      if (updateUsersDto.password) {
        const salt = await bcryptjs.genSalt(10);
        updateUsersDto.password = await bcryptjs.hash(
          updateUsersDto.password,
          salt,
        );
      }

      await this.userRepository.update(id, updateUsersDto);

      const { username, email, createdAt, updatedAt } =
        await this.userRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'User updated sucessfully',
        data: {
          id,
          username,
          email,
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
      const userToDelete = await this.userRepository.findOneBy({ id });
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

      await this.userRepository.remove(userToDelete);

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

  async findOne(data: any) {
    try {
      const userFetched: User = await this.userRepository.findOne(data);

      if (!userFetched.active) {
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Usuário Desativado.',
            path: '/users/user/id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (!userFetched)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Usuário não encontrado.',
            path: '/users/user/id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        id: userFetched.id,
        username: userFetched.username,
        password: userFetched.password,
      };
    } catch (error) {
      console.log(`Failed to fetch User | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: error.message,
          error: error.message,
          path: '/users/user/id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async lastUsersRegistered() {
    try {
      const [lastTwoDoctors] = await Promise.all([
        this.userRepository.find({
          order: { createdAt: 'DESC' },
          take: 2,
        }),
      ]);

      return {
        statusCode: 200,
        method: 'PUT',
        message: ' fetched sucessfully',
        data: {
          lastTwoDoctors,
        },
        path: '/users/lastusers',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to lastUsersRegistered| Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Password',
          error: error.message,
          path: '/users/password/user/update',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async ban(id: string) {
    try {
      console.log('oieee', id);
      const bannedUser = this.userRepository.update(id, {
        active: false,
      });

      return {
        statusCode: 200,
        method: 'PUT',
        message: ' fetched sucessfully',
        data: {
          banned: true,
          bannedUser,
        },
        path: '/users/lastusers',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to lastUsersRegistered| Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Password',
          error: error.message,
          path: '/users/password/user/update',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async active(id: string) {
    try {
      console.log('oieee', id);
      const bannedUser = this.userRepository.update(id, {
        active: true,
      });

      return {
        statusCode: 200,
        method: 'PUT',
        message: ' activado sucessfully',
        data: {
          banned: true,
          bannedUser,
        },
        path: '/users/lastusers',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to lastUsersRegistered| Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Password',
          error: error.message,
          path: '/users/password/user/update',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
