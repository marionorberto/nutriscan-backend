import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClinicalProfileDto } from './dtos/create-clinical-profiles.dto';
import { UpdateClinicalProfileDto } from './dtos/update-clinical-profiles.dto';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { Request } from 'express';
import { ClinicalProfiles } from '@database/entities/clinical-profiles/clinical-profile.entity';
import { UsersService } from '@modules/users/users.service';
import { EnumPhysicalActivityLevel } from './interfaces/interfaces';
import { AssociatedConditions } from '@database/entities/associated-conditions/associated-condition.entity';
@Injectable()
export class ClinicalProfilesService {
  private userRepository: Repository<User>;
  private clinicalProfileRepo: Repository<ClinicalProfiles>;
  private acRepo: Repository<AssociatedConditions>;
  private readonly userService: UsersService;
  constructor(private readonly datasource: DataSource) {
    this.userRepository = this.datasource.getRepository(User);
    this.acRepo = this.datasource.getRepository(AssociatedConditions);
    this.clinicalProfileRepo = this.datasource.getRepository(ClinicalProfiles);
  }

  async findOne(request: Request) {
    try {
      const { userId } = request['user'];

      const data = await this.clinicalProfileRepo.findOne({
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
        path: request.url,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message:
            'Não foi possível encontrar os dados das suas dados de perfil clínico. Por favor tente novamente mais tarde!',
          error: error.message,
          path: '/app-clinical-profiles/all',
          timestamp: Date.now(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createClinicalProfileDto: CreateClinicalProfileDto) {
    try {
      const clinicalProfileToSave = this.clinicalProfileRepo.create({
        ...createClinicalProfileDto,
        physicalActivityLevel:
          EnumPhysicalActivityLevel[
            createClinicalProfileDto.physicalActivityLevel.toLocaleLowerCase()
          ],
      });

      const clinicalProfileSaved = await this.clinicalProfileRepo.save({
        ...clinicalProfileToSave,
        user: {
          id: createClinicalProfileDto.userID,
        },
      });

      const {
        id,
        weight,
        height,
        physicalActivityLevel,
        bmi,
        active,
        createdAt,
      } = clinicalProfileSaved;

      // 1️⃣ Buscar o usuário com relações
      const user = await this.userRepository.findOne({
        where: { id: createClinicalProfileDto.userID },
        relations: {
          associatedCondition: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // 2️⃣ Buscar as conditions pelo array de IDs
      const conditions = await this.acRepo.findBy({
        id: In(createClinicalProfileDto.selectedConditions),
      });

      if (
        conditions.length !== createClinicalProfileDto.selectedConditions.length
      ) {
        throw new BadRequestException(
          'Uma ou mais condições não foram encontradas',
        );
      }

      // 3️⃣ Associar (substitui as existentes)
      user.associatedCondition = conditions;

      // 4️⃣ Salvar
      await this.userRepository.save(user);

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Dados Clínicos criadas com sucesso!',
        data: {
          id,
          weight,
          height,
          physicalActivityLevel,
          bmi,
          active,
          createdAt,
        },
        path: '/clinical-profiles/create/clinical-profile',
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: `Não foi possíve atender à essa requisição. Por favor tente novamente mais tarde!`,
          error: error.message,
          path: '/clinical-profiles/create/clinical-profile',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    request: Request,
    updateClinicalProfileDto: Partial<UpdateClinicalProfileDto>,
  ) {
    try {
      await this.clinicalProfileRepo.update(updateClinicalProfileDto.id, {
        ...updateClinicalProfileDto,
        physicalActivityLevel:
          EnumPhysicalActivityLevel[
            updateClinicalProfileDto.physicalActivityLevel.toLocaleLowerCase()
          ],
      });

      const {
        height,
        weight,
        bmi,
        physicalActivityLevel,
        active,
        createdAt,
        updatedAt,
      } = await this.clinicalProfileRepo.findOneBy({
        id: updateClinicalProfileDto.id,
      });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Dados Clínicos atualizadas com sucesso!',
        data: {
          id: updateClinicalProfileDto.id,
          height,
          weight,
          bmi,
          physicalActivityLevel,
          active,
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

      const clinicalProfileToDelete = await this.clinicalProfileRepo.findOneBy({
        id,
      });

      if (!clinicalProfileToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Nenhuma dados de configuração encontrada.',
            path: '/app-clinical-profiles/app-clinical-profile/' + id,
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.clinicalProfileRepo.remove(clinicalProfileToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Seus Dados Clínicos foram apagadas com sucesso!',
        path: '/app-clinical-profiles/delete/setting/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Dados de perfil clínico foram apagadas com sucesso!',
          error: error.message,
          path: '/app-clinical-profiles/app-clinical-profile/' + id,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findUserInfo(id: string) {
    try {
      const data = await this.clinicalProfileRepo.findOne({
        where: {
          user: {
            id,
          },
        },
      });

      return {
        bmi: data.height / Math.pow(data.weight, 2),
        physicalActivityLevel: data.physicalActivityLevel,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message:
            'medical - Não foi possível encontrar os dados das suas dados de perfil clínico. Por favor tente novamente mais tarde!',
          error: error.message,
          path: '/app-clinical-profiles/all',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

// Exemplo Prático: Peso: 70 kgAltura: 1,75 mCálculo: \(70\div (1,75\times 1,75)=70\div 3,06=22,86\)Resultado: 22,86 (Peso Normal). Tabela de Classificação (Adultos): < 18,5: Abaixo do peso18,5 - 24,9: Peso normal25,0 - 29,9: Sobrepeso30,0 - 34,9: Obesidade grau I35,0 - 39,9: Obesidade grau II> 40,0: Obesidade grau III
