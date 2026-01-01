import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dtos/create-feebacks.dto';
import { UpdateFeedbackDto } from './dtos/update-feedbacks.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';
import { Feedbacks } from '@database/entities/feedbacks/feedback.entity';
@Injectable()
export class FeedbacksService {
  private userRepository: Repository<User>;
  private feedbackRepo: Repository<Feedbacks>;
  private readonly userService: UsersService;
  constructor(private readonly datasource: DataSource) {
    this.userRepository = this.datasource.getRepository(User);
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
            method: 'GET',
            message: 'User do not have suficcient permission',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.FORBIDDEN,
        );

      const feedbacks = await this.feedbackRepo.findAndCount();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Feedbacks fetched sucessfully.',
        data: feedbacks,
        path: '/feedbacks/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this Feedbacks. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this feedback.',
          error: error.message,
          path: '/feedbacks/feedback/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByPk(id: string, request: Request) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      const feedback = this.feedbackRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Feedback fetched sucessfully.',
        data: feedback,
        path: '/feedbacks/feedback/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this feedback. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this feedback.',
          error: error.message,
          path: '/feedbacks/feedback/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(request: Request, createFeedbackDto: CreateFeedbackDto) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      const feedbackToSave = this.feedbackRepo.create(createFeedbackDto);
      const feedbackSaved = await this.feedbackRepo.save(feedbackToSave);

      const { id, rate, comment, feedbackType, createdAt } = feedbackSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Feedback created sucessfully',
        data: {
          id,
          rate,
          comment,
          feedbackType,
          createdAt,
        },
        path: '/feedbacks/create/feedback',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed  to create a new Feedback | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: `Falhou ao cadastrar feedback, ${error.message}`,
          error: error.message,
          path: '/feedbacks/create/feedback',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    request: Request,
    UpdateFeedbackDto: Partial<UpdateFeedbackDto>,
  ) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      await this.feedbackRepo.update(id, UpdateFeedbackDto);

      const { comment, rate, feedbackType, createdAt, updatedAt } =
        await this.feedbackRepo.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'User updated sucessfully',
        data: {
          id,
          comment,
          rate,
          feedbackType,
          createdAt,
          updatedAt,
        },
        path: '/feedbacks/update/feedback/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new Feedback | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Não foi possível atualizar dados do feedback!',
          error: error.message,
          path: '/feedbacks/update/feedback/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string, request: Request) {
    try {
      const { idUser } = request['user'];

      this.userService.checkUserIsAuthenticated(idUser);

      const feedbackToDelete = await this.feedbackRepo.findOneBy({ id });

      if (!feedbackToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Feedback Not Found',
            path: '/feedbacks/feedback/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.feedbackRepo.remove(feedbackToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Feedback deleted sucessfully',
        path: '/feedbacks/delete/feedback/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete Feedback | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete Feedback',
          error: error.message,
          path: '/feedbacks/delete/feedback/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
