import {
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUsersDto } from './dtos/create-users.dto';
import { UpdateUsersDto } from './dtos/update-users.dto';
// import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { EmailService } from 'shared/email/email.service';
import { Profiles } from '@database/entities/profile/profile.entity';
import { AssociatedConditions } from '@database/entities/associated-conditions/associated-condition.entity';
@Injectable()
export class UsersService {
  private userRepo: Repository<User>;
  private profileRepo: Repository<Profiles>;
  private associatedConditionRepo: Repository<AssociatedConditions>;
  constructor(
    private readonly datasource: DataSource,
    private readonly emailService: EmailService,
  ) {
    this.userRepo = this.datasource.getRepository(User);
    this.profileRepo = this.datasource.getRepository(Profiles);
    this.associatedConditionRepo =
      this.datasource.getRepository(AssociatedConditions);
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
      const { userId } = request['user'];

      const user = await this.userRepo.findOneBy({ id: userId });

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
      const userToSave = this.userRepo.create(createUsersDto);

      this.emailService.sendRegistrationCode(createUsersDto.email);

      const userSaved = await this.userRepo.save(userToSave);

      const { id, firstname, lastname, username, email, createdAt } = userSaved;

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
      const profileFetched: Profiles = await this.profileRepo.findOne({
        where: {
          user: {
            id: userFetched.id,
          },
        },
      });

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
        password: userFetched.password,
        img: profileFetched.img,
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

  async alreadyAnEmailRegisted(data: { email: string }) {
    try {
      // Busca o usuário pelo email
      const user = await this.userRepo.findOne({
        where: {
          email: data.email,
        },
      });

      // Se o usuário existir, significa que o email já está registrado
      if (user) {
        return {
          statusCode: 200,
          method: 'GET',
          message: 'Email já foi registado.',
          data: { registered: true },
          path: '/users/check/email',
          timestamp: Date.now(),
        };
      }

      // Se não existir, o email está disponível
      return {
        statusCode: 200,
        method: 'GET',
        message: 'Email is available for registration.',
        data: { registered: false },
        path: '/users/check/email',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to check email registration. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 500, // Erro interno ao tentar consultar o banco
          method: 'GET',
          message: 'Failed to check if email exists.',
          error: error.message,
          path: '/users/check/email',
          timestamp: Date.now(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bindAssociateConditions(userID: string, selectedConditions: string[]) {
    try {
      console.log('tres', userID, selectedConditions);
      // 1️⃣ Buscar o usuário com relações
      const user = await this.userRepo.findOne({
        where: { id: userID },
        relations: {
          associatedCondition: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // 2️⃣ Buscar as conditions pelo array de IDs
      const conditions = await this.associatedConditionRepo.findBy({
        id: In(selectedConditions),
      });

      if (conditions.length !== selectedConditions.length) {
        throw new BadRequestException(
          'Uma ou mais condições não foram encontradas',
        );
      }

      // 3️⃣ Associar (substitui as existentes)
      user.associatedCondition = conditions;

      // 4️⃣ Salvar
      await this.userRepo.save(user);
    } catch (error) {
      // Tratamento de erro dinâmico e preciso
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Falha ao associar condições de saúde ao usuário.',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
