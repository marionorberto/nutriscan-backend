import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from '@modules/users/users.service';
import { User } from '@database/entities/users/user.entity';
import * as bcryptjs from 'bcryptjs';

@Controller('auth')
export class AuthController {
  private userRepository: Repository<User>;
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
    private readonly datasource: DataSource,
  ) {
    this.userRepository = this.datasource.getRepository(User);
  }

  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const token = crypto.randomBytes(32).toString('hex'); // Gerar token único
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Expira em 1h
    await this.userRepository.save(user);

    return { message: 'E-mail de recuperação enviado com sucesso' };
  }

  @Post('reset-password')
  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    user.password = await bcryptjs.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    return { message: 'Senha redefinida com sucesso' };
  }
}
