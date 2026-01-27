import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from '@modules/users/users.service';
import { SignInDto } from './dtos/sign-in.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '@database/entities/users/user.entity';
import { EnumTypeUser } from '@modules/profiles/interfaces/interfaces';

@Injectable()
export class AuthService {
  private userRepo: Repository<User>;
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly datasource: DataSource,
  ) {
    this.userRepo = this.datasource.getRepository(User);
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    try {
      const userData = await this.usersService.findOne({
        where: {
          email: signInDto.email,
        },
      });

      if (!userData.id) {
        throw new HttpException(
          {
            statusCode: 401,
            method: 'POST',
            message: 'Email não encontrado.',
            path: '/auth/login',
            timestamp: Date.now(),
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await this.validatePassword(
        signInDto.password,
        userData.password,
      );

      if (!isPasswordValid)
        throw new HttpException(
          {
            statusCode: 401,
            method: 'POST',
            message: 'password inválida.',
            path: '/auth/login',
            timestamp: Date.now(),
          },
          HttpStatus.UNAUTHORIZED,
        );

      const payloads = {
        userId: userData.id,
        username: userData.username,
        role: userData.role,
        img: userData.img,
      };

      return {
        acess_token: await this.jwtService.signAsync(payloads),
        userId: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        img: userData.img,
      };
    } catch (error) {
      console.log(
        `Failed to authenticate User | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 401,
          method: 'POST',
          message: error.response.message,
          error: error.message,
          path: '/auth/login',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  } //

  async signInAdmin(signInDto: SignInDto): Promise<any> {
    try {
      console.log(signInDto);
      const userData = await this.usersService.findOneAdmin({
        where: {
          email: signInDto.email,
          role: EnumTypeUser.admin,
        },
      });

      console.log(userData);

      if (!userData.id) {
        throw new HttpException(
          {
            statusCode: 401,
            method: 'POST',
            message: 'Email não encontrado/Autorizado.',
            path: '/auth/login-admin',
            timestamp: Date.now(),
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await this.validatePassword(
        signInDto.password,
        userData.password,
      );

      if (!isPasswordValid)
        throw new HttpException(
          {
            statusCode: 401,
            method: 'POST',
            message: 'password inválida.',
            path: '/auth/login-admin',
            timestamp: Date.now(),
          },
          HttpStatus.UNAUTHORIZED,
        );

      const payloads = {
        userId: userData.id,
        username: userData.username,
        role: userData.role,
        // img: userData.img,
      };

      return {
        acess_token: await this.jwtService.signAsync(payloads),
        userId: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        // img: userData.img,
      };
    } catch (error) {
      console.log(
        `Failed to authenticate User | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 401,
          method: 'POST',
          message: error.response.message,
          error: error.message,
          path: '/auth/login-admin',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  } //

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcryptjs.compare(plainPassword, hashedPassword);
  }
}
