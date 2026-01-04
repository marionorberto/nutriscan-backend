import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateReferencedImageDto } from './dtos/update-referenced-images.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { ReferencedImages } from '@database/entities/reference-images/reference-image.entity';
import { UsersService } from '@modules/users/users.service';
@Injectable()
export class ReferencedImageService {
  private userRepository: Repository<User>;
  private userService: UsersService;
  private referencedImageRepo: Repository<ReferencedImages>;
  constructor(private readonly datasource: DataSource) {
    this.userRepository = this.datasource.getRepository(User);
    this.referencedImageRepo = this.datasource.getRepository(ReferencedImages);
  }
  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const user = await this.userService.checkUserIsAuthenticated(idUser);

      if (user) {
        const data = this.referencedImageRepo.findAndCount({
          where: {
            foodItem: {
              user,
            },
          },
        });

        return {
          statusCode: 200,
          method: 'GET',
          message: 'registos encontradas com sucesso!',
          data: data,
          path: request.url,
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message:
            'Não foi possível encontrar os dados das suas definições. Por favor tente novamente mais tarde!',
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

      const user = await this.userService.checkUserIsAuthenticated(idUser);

      if (user) {
        const data = this.referencedImageRepo.findOneBy({
          id,
        });

        return {
          statusCode: 200,
          method: 'GET',
          message: 'Registo encontrado com sucesso!',
          data: data,
          path: request.url,
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
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(file: Express.Multer.File, request: Request) {
    try {
      const { idUser } = request['user'];

      const user = await this.userService.checkUserIsAuthenticated(idUser);

      const referencedImageToSave = this.referencedImageRepo.create({
        filename: file.filename,
        filepath: file.path,
        imageType: file.mimetype,
      });

      const referencedImageSaved = await this.referencedImageRepo.save({
        ...referencedImageToSave,
        user,
      });

      const { id, filename, filepath, imageType, foodItem, createdAt } =
        referencedImageSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Registo criado com sucesso!',
        data: {
          id,
          filename,
          filepath,
          imageType,
          foodItem,
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
          message: `Não foi possíve atender à essa requisição. Por favor tente novamente mais tarde!`,
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
    updateAppSettingsDto: Partial<UpdateReferencedImageDto>,
  ) {
    try {
      const { idUser } = request['user'];

      await this.userService.checkUserIsAuthenticated(idUser);

      await this.referencedImageRepo.update(id, updateAppSettingsDto);

      const { filename, filepath, imageType, foodItem, createdAt, updatedAt } =
        await this.referencedImageRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Registo atualizado com sucesso!',
        data: {
          id,
          filename,
          filepath,
          imageType,
          foodItem,
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
            'Não foi possível atualizar dados, tente novamente mais tarde!',
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

      const referencedImageToDelete = await this.referencedImageRepo.findOneBy({
        id,
      });

      if (!referencedImageToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Nenhuma registo encotrado.',
            path: request.url,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.referencedImageRepo.remove(referencedImageToDelete);

      return {
        statusCode: 201,
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
          message: 'Não foi possível apagar o registo!',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
