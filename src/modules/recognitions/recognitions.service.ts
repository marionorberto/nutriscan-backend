import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRecognitionDto } from './dtos/create-recognitions.dto';
import { UpdateRecognitionDto } from './dtos/update-recognitions.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { Recognitions } from '@database/entities/recognitions/recognition.entity';
import { UsersService } from '@modules/users/users.service';
@Injectable()
export class RecognitionService {
  private userRepository: Repository<User>;
  private recognitionRepo: Repository<Recognitions>;
  private userService: UsersService;
  constructor(private readonly datasource: DataSource) {
    this.userRepository = this.datasource.getRepository(User);
    this.recognitionRepo = this.datasource.getRepository(Recognitions);
  }
  async findAll(request: Request) {
    try {
      const all = await this.recognitionRepo.find({
        relations: {
          user: true,
          foodItem: true,
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Requisição atendida com sucesso!',
        data: all,
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this feedback.',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByPk(request: Request) {
    try {
      const { userId } = request['user'];

      this.userService.checkUserIsAuthenticated(userId);

      const feedback = this.recognitionRepo.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Feedback fetched sucessfully.',
        data: feedback,
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message:
            'Não é possível atender a essa requisição. Tente novamente mais tarde!',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(request: Request, CreateRecognitionDto: CreateRecognitionDto) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      const recognitionToSave =
        this.recognitionRepo.create(CreateRecognitionDto);
      const recognitionSaved =
        await this.recognitionRepo.save(recognitionToSave);

      const { id, foodItem, imagePath, modeAccurancy, timestamp, createdAt } =
        recognitionSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Registo criado com sucesso!',
        data: {
          id,
          foodItem,
          imagePath,
          modeAccurancy,
          timestamp,
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
          message:
            'Não é possível atender a essa requisição. Tente novamente mais tarde!',
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
    updateRecognitionDto: Partial<UpdateRecognitionDto>,
  ) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      await this.recognitionRepo.update(id, updateRecognitionDto);

      const {
        imagePath,
        modeAccurancy,
        timestamp,
        foodItem,
        createdAt,
        updatedAt,
      } = await this.recognitionRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Registo atualizado com sucesso!',
        data: {
          id,
          imagePath,
          modeAccurancy,
          timestamp,
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
            'Não foi possível atender a essa requisição. Tente mais tarde!',
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

      const recognitionToDelete = await this.recognitionRepo.findOneBy({ id });

      if (!recognitionToDelete)
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

      await this.recognitionRepo.remove(recognitionToDelete);

      return {
        statusCode: 200,
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
          message:
            'Não é possível atender a essa requisição. Tente novamente mais tarde!',
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
