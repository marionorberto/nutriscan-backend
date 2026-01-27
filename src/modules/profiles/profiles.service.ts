import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfilesDto } from './dtos/create-profiles.dto';
import { UpdateProfilesDto } from './dtos/update-profiles.dto';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';
import { EmailService } from 'shared/email/email.service';
import { Profiles } from '@database/entities/profile/profile.entity';
import { ProfileAdmin } from '@database/entities/profile-admin/profile-admin.entity';
import { CreateProfilesAdminDto } from './dtos/create-profiles-admin.dto';
import { UpdateProfilesAdminDto } from './dtos/update-profiles-admin.dto';
@Injectable()
export class ProfilesService {
  private profileRepo: Repository<Profiles>;
  private profileAdminRepo: Repository<ProfileAdmin>;
  constructor(
    private readonly datasource: DataSource,
    private readonly emailService: EmailService,
  ) {
    this.profileRepo = this.datasource.getRepository(Profiles);
    this.profileAdminRepo = this.datasource.getRepository(ProfileAdmin);
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
      const { userId } = request['user'];

      console.log('idUser -> ', idUser);
      console.log('userId -> ', userId);

      const user = await this.profileRepo.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });

      console.log('user -> ', user);

      if (!user)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this user.',
            path: request.url,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'User fetched sucessfully.',
        data: user,
        path: request.url,
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
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findProfileAdmin(request: Request) {
    try {
      const { userId } = request['user'];

      const profile = await this.profileAdminRepo.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });

      if (!profile)
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

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Solicitação atendida com sucesso.',
        data: profile,
        path: request.url,
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

  async createAdmin(createProfilesDto: CreateProfilesAdminDto) {
    try {
      console.log(createProfilesDto);
      const userToSave = this.profileAdminRepo.create(createProfilesDto);

      const userSaved = await this.profileAdminRepo.save({
        ...userToSave,
        user: {
          id: createProfilesDto.userID,
        },
      });

      // const { id, address, birthday, gender, phone,  createdAt } = userSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'User created sucessfully',
        data: userSaved,
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
    updateProfilesDto: Partial<UpdateProfilesDto>,
  ) {
    try {
      await this.profileRepo.update(updateProfilesDto.id, updateProfilesDto);

      const { address, birthday, phone, gender, createdAt, updatedAt } =
        await this.profileRepo.findOneBy({ id: updateProfilesDto.id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'User updated sucessfully',
        data: {
          id: updateProfilesDto.id,
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

  async updateOneAdmin(
    request: Request,
    updateProfilesAdminDto: Partial<UpdateProfilesAdminDto>,
  ) {
    try {
      await this.profileAdminRepo.update(
        updateProfilesAdminDto.userID,
        updateProfilesAdminDto,
      );

      const { address, birthday, phone, gender, createdAt, updatedAt } =
        await this.profileAdminRepo.findOneBy({
          id: updateProfilesAdminDto.userID,
        });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Solicitação atendida com sucesso!',
        data: {
          id: updateProfilesAdminDto.userID,
          address,
          birthday,
          phone,
          gender,
          createdAt,
          updatedAt,
        },
        path: request.url,
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
          path: request.url,
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
