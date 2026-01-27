import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dtos/create-feebacks.dto';
import { UpdateFeedbackDto } from './dtos/update-feedbacks.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';
import { Feedbacks } from '@database/entities/feedbacks/feedback.entity';
import { EnumFeedbackType } from './interfaces/interfaces';
@Injectable()
export class FeedbacksService {
  private userRepository: Repository<User>;
  private feedbackRepo: Repository<Feedbacks>;
  constructor(
    private readonly datasource: DataSource,
    private readonly userService: UsersService,
  ) {
    this.userRepository = this.datasource.getRepository(User);
    this.feedbackRepo = this.datasource.getRepository(Feedbacks);
  }

  async findAll() {
    try {
      const feedbacks = await this.feedbackRepo.find();

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
          message: error.message,
          error: error.message,
          path: '/feedbacks/feedback/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByPk(request: Request) {
    try {
      const { userId } = request['user'];

      const feedback = await this.feedbackRepo.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Registo encontrado com sucesso!',
        data: feedback,
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Error, finding feedback: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: error.message,
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(request: Request, createFeedbackDto: CreateFeedbackDto) {
    try {
      const { userId } = request['user'];

      const user = await this.userService.checkUserIsAuthenticated(userId);

      const feedbackToSave = this.feedbackRepo.create({
        ...createFeedbackDto,
        feedbackType: EnumFeedbackType[createFeedbackDto.feedbackType],
      });
      const feedbackSaved = await this.feedbackRepo.save({
        ...feedbackToSave,
        user,
      });

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
        path: request.url,
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
          message: error.message,
          error: error.message,
          path: request.url,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    request: Request,
    updateFeedbackDto: Partial<UpdateFeedbackDto>,
  ) {
    try {
      await this.feedbackRepo.update(updateFeedbackDto.id, {
        ...updateFeedbackDto,
        feedbackType: EnumFeedbackType[updateFeedbackDto.feedbackType],
      });

      const { comment, rate, feedbackType, createdAt, updatedAt } =
        await this.feedbackRepo.findOneBy({ id: updateFeedbackDto.id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Registo Atualizado com sucesso!',
        data: {
          id: updateFeedbackDto.id,
          comment,
          rate,
          feedbackType,
          createdAt,
          updatedAt,
        },
        path: request.url,
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
          message: error.message,
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
