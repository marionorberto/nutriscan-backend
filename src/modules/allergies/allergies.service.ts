import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAllergyDto } from './dtos/create-allergies.dto';
import { UpdateAllergyDto } from './dtos/update-allergies.dto';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { Allergies } from '@database/entities/allergies/allergy.entity';
import { UsersService } from '@modules/users/users.service';
import { CreateAllergyAssociationDto } from './dtos/create-allergies-association.dto';
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

  async findAll() {
    try {
      const allergies = await this.allergyRepo.findAndCount();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Allergies fetched sucessfully.',
        data: allergies,
        path: '/allergies/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this allergy.',
          error: error.message,
          path: '/allergies/all',
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

  async create(createAllergyDto: CreateAllergyDto) {
    try {
      const allergyToSave = this.allergyRepo.create(createAllergyDto);
      const allergySaved = await this.allergyRepo.save(allergyToSave);

      const { id, description, note, createdAt } = allergySaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Allergia criada com sucesso!',
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
      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: `Falha ao cadastrar nova *Allergia`,
          error: error.message,
          path: '/allergies/create/allergy',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createAssociation(createAllergyDto: CreateAllergyAssociationDto) {
    try {
      // 1️⃣ Buscar o usuário com relações
      const user = await this.userRepo.findOne({
        where: { id: createAllergyDto.userID },
        relations: {
          allergies: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // 2️⃣ Buscar as conditions pelo array de IDs
      const allergies = await this.allergyRepo.findBy({
        id: In(createAllergyDto.allergies),
      });

      if (allergies.length !== createAllergyDto.allergies.length) {
        throw new BadRequestException(
          'Uma ou mais condições não foram encontradas',
        );
      }

      // 3️⃣ Associar (substitui as existentes)
      user.allergies = allergies;

      // 4️⃣ Salvar
      await this.userRepo.save(user);

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Allergia criada com sucesso!',
        data: {
          status: 'Registo criado com sucesso!',
        },
        path: '/allergies/create/allergy',
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: `Falha ao cadastrar nova *Allergia`,
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

  async findUserInfo(id: string) {
    try {
      const data = await this.userRepo.findOne({
        where: {
          id,
        },
        relations: {
          allergies: true,
        },
      });

      if (!data || !data.allergies) return [];
      return data.allergies; // Não precisa de forEach para clonar
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
