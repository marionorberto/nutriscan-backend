import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dtos/create-users.dto';
import { UpdateUsersDto } from './dtos/update-users.dto';
// import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { EmailService } from 'shared/email/email.service';
@Injectable()
export class UsersService {
  private userRepo: Repository<User>;
  constructor(
    private readonly datasource: DataSource,
    private readonly emailService: EmailService,
  ) {
    this.userRepo = this.datasource.getRepository(User);
  }

  async findAll() {
    try {
      const users = await this.userRepo.find({
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
      const user = await this.userRepo.findOneBy({ id });

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

  async create(createUsersDto: CreateUsersDto) {
    try {
      // const token = crypto.randomInt(10000, 99999).toString().padStart(6, '0'); // Gerar token de 6 dígitos únicos.

      // console.log('this is the token', token);

      const userToSave = this.userRepo.create(createUsersDto);

      this.emailService.sendRegistrationCode(createUsersDto.email);

      const userSaved = await this.userRepo.save(userToSave);

      const {
        id,
        firstname,
        lastname,
        username,
        email,
        phone,
        address,
        gender,
        createdAt,
      } = userSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'User created sucessfully',
        data: {
          id,
          firstname,
          lastname,
          username,
          email,
          phone,
          address,
          gender,
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

      await this.userRepo.update(id, updateUsersDto);

      const { username, email, createdAt, updatedAt } =
        await this.userRepo.findOneBy({ id });

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
      const userToDelete = await this.userRepo.findOneBy({ id });
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

      await this.userRepo.remove(userToDelete);

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
      const userFetched: User = await this.userRepo.findOne(data);

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
        email: userFetched.email,
        role: userFetched.role,
        img: userFetched.img,
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

  async updatePassword(
    request: Request,
    updatePasswordDTO: Partial<UpdatePasswordDto>,
  ) {
    try {
      const { idUser: id } = request['user'];

      const isPasswordEqual =
        updatePasswordDTO.atualPassword === updatePasswordDTO.newPassword;

      if (isPasswordEqual)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'PUT',
            message: 'Password devem ser iguais.',
            path: '/password/user/update',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      const { password: passwordFromDB } = await this.userRepo
        .createQueryBuilder('user')
        .select('user.password')
        .where('user.id = :id', { id })
        .getOne();

      if (
        !(await bcryptjs.compare(
          updatePasswordDTO.atualPassword,
          passwordFromDB,
        ))
      )
        throw new HttpException(
          {
            statusCode: 404,
            method: 'PUT',
            message: 'A atual password é inválida.',
            path: '/password/user/update',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      if (updatePasswordDTO.newPassword) {
        const salt = await bcryptjs.genSalt(10);
        updatePasswordDTO.newPassword = await bcryptjs.hash(
          updatePasswordDTO.newPassword,
          salt,
        );
      }

      await this.userRepo.update(id, {
        password: updatePasswordDTO.newPassword,
      });

      const { username, email, createdAt, updatedAt } =
        await this.userRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Password updated sucessfully',
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
        `Failed to update new password| Error Message: ${error.message}`,
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

  async lastUsersRegistered() {
    try {
      const [lastTwoDoctors] = await Promise.all([
        this.userRepo.find({
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

  async banUser(id: string) {
    try {
      console.log('oieee', id);
      const bannedUser = this.userRepo.update(id, {
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

  async activeUser(id: string) {
    try {
      console.log('oieee', id);
      const bannedUser = this.userRepo.update(id, {
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

  async inactiveUser(id: string) {
    try {
      console.log('oieee', id);
      const bannedUser = this.userRepo.update(id, {
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

  checkUserIsAdmin(user: User) {
    return user.role == 'ADMIN';
  }

  async checkUserIsAuthenticated(id: string) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user)
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Usuário não autenticado, tente novamente mais tarde!',
          path: '/users/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );

    return user;
  }
}
