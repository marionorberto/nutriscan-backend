import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDiabeteProfileDto } from './dtos/create-diabete-profiles.dto';
import { UpdateDiabeteProfileDto } from './dtos/update-diabete-profiles.dto';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';
import { DiabeteProfiles } from '@database/entities/diabeti-profiles/diabeti_profile.entity';
import { ClinicalProfilesService } from '@modules/clinical-profiles/clinical-profiles.service';
import { AllergiesService } from '@modules/allergies/allergies.service';
import { AssociatedConditionsService } from '@modules/associated-conditions/associated-conditions.service';
import {
  EnumHyperGlycemiaFrequency,
  EnumHypoGlycemiaFrequency,
  EnumCurrentStatus,
  EnumDiabetiType,
} from './interfaces/interfaces';
@Injectable()
export class DiabeteProfilesService {
  private diabeteProfileRepo: Repository<DiabeteProfiles>;
  constructor(
    private readonly datasource: DataSource,
    private readonly medicalProfileService: ClinicalProfilesService,
    private readonly allergiesService: AllergiesService,
    private readonly associatedConditionService: AssociatedConditionsService,
    private readonly userService: UsersService,
  ) {
    this.diabeteProfileRepo = this.datasource.getRepository(DiabeteProfiles);
  }
  async findOne(request: Request) {
    try {
      const { userId } = request['user'];

      const user = await this.userService.checkUserIsAuthenticated(userId);

      if (user) {
        const data = await this.diabeteProfileRepo.findOne({
          where: {
            user: {
              id: userId,
            },
          },
        });

        return {
          statusCode: 200,
          method: 'GET',
          message: 'Dados de perfil clínico encontradas com sucesso!',
          data: data,
          path: '/diabete-profiles/all',
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message:
            'Não foi possível encontrar os dados das suas dados de perfil clínico. Por favor tente novamente mais tarde!',
          error: error.message,
          path: '/app-diabete-profiles/all',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createDiabeteProfileDto: CreateDiabeteProfileDto) {
    try {
      const diabeteProfileToSave = this.diabeteProfileRepo.create({
        ...createDiabeteProfileDto,
        currentStatus: EnumCurrentStatus[createDiabeteProfileDto.currentStatus],
        diabetiType: EnumDiabetiType[createDiabeteProfileDto.diabetiType],
        hyperGlycemiaFrequency:
          EnumHyperGlycemiaFrequency[
            createDiabeteProfileDto.hyperGlycemiaFrequency
          ],
        hypoGlycemiaFrequency:
          EnumHypoGlycemiaFrequency[
            createDiabeteProfileDto.hypoGlycemiaFrequency
          ],
      });

      const diabeteProfileSaved = await this.diabeteProfileRepo.save({
        ...diabeteProfileToSave,
        user: {
          id: createDiabeteProfileDto.userID,
        },
      });

      const { id, currentStatus, diabetiType, diagnosisYear, createdAt } =
        diabeteProfileSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Dados Clínicos criadas com sucesso!',
        data: {
          id,
          currentStatus,
          diabetiType,
          diagnosisYear,
          createdAt,
        },
        path: '/diabete-profiles/create/diabete-profile',
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: `Não foi possíve atender à essa requisição. Por favor tente novamente mais tarde!`,
          error: error.message,
          path: '/diabete-profiles/create/diabete-profile',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    request: Request,
    updateDiabeteProfileDto: Partial<UpdateDiabeteProfileDto>,
  ) {
    try {
      const { userId } = request['user'];

      await this.userService.checkUserIsAuthenticated(userId);

      await this.diabeteProfileRepo.update(updateDiabeteProfileDto.id, {
        ...updateDiabeteProfileDto,
        currentStatus: EnumCurrentStatus[updateDiabeteProfileDto.currentStatus],
        diabetiType: EnumDiabetiType[updateDiabeteProfileDto.diabetiType],
        hyperGlycemiaFrequency:
          EnumHyperGlycemiaFrequency[
            updateDiabeteProfileDto.hyperGlycemiaFrequency
          ],
        hypoGlycemiaFrequency:
          EnumHypoGlycemiaFrequency[
            updateDiabeteProfileDto.hypoGlycemiaFrequency
          ],
      });

      const {
        currentStatus,
        diabetiType,
        diagnosisYear,
        hyperGlycemiaFrequency,
        hypoGlycemiaFrequency,
        lastFastingGlucose,
        lastHba1c,
        createdAt,
        updatedAt,
      } = await this.diabeteProfileRepo.findOneBy({
        id: updateDiabeteProfileDto.id,
      });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Dados Clínicos atualizadas com sucesso!',
        data: {
          id: updateDiabeteProfileDto.id,
          currentStatus,
          diabetiType,
          diagnosisYear,
          hyperGlycemiaFrequency,
          hypoGlycemiaFrequency,
          lastFastingGlucose,
          lastHba1c,
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

      const diabeteProfileToDelete = await this.diabeteProfileRepo.findOneBy({
        id,
      });

      if (!diabeteProfileToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Nenhum registo encontrado.',
            path: '/diabete-profiles/delete/diabete-profile/' + id,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.diabeteProfileRepo.remove(diabeteProfileToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Registo apagado com sucesso!',
        path: '/diabete-profiles/delete/diabete-profile/' + id,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message:
            'Não foi possível atender essa requisição. Tente novamente mais tarde!',
          error: error.message,
          path: '/diabete-profiles/delete/diabete-profile/' + id,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async gatherProfileData(id: string) {
    //profile medical
    const medicalProfileData =
      await this.medicalProfileService.findUserInfo(id);

    //diabete profile
    const diabeteData = await this.findUserInfo(id);

    //allergies profile
    const allergiesData = await this.allergiesService.findUserInfo(id);

    //associated-conditions profile
    const associatedConditionData =
      await this.associatedConditionService.findUserInfo(id);

    return {
      medicalProfileData,
      diabeteData,
      allergiesData,
      associatedConditionData,
    };
  }

  async findUserInfo(id: string) {
    try {
      const data = await this.diabeteProfileRepo.findOne({
        where: {
          user: {
            id,
          },
        },
      });

      return {
        diabeteType: data.diabetiType,
        hyperGlycemiaFrequency: data.hyperGlycemiaFrequency,
        hypoGlycemiaFrequency: data.hypoGlycemiaFrequency,
        currentStatus: data.currentStatus,
        lastFastingGlucose: data.lastFastingGlucose,
        lastHba1c: data.lastHba1c,
      };
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
