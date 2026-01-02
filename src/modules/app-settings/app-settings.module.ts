import { Module } from '@nestjs/common';
import { AppSettingsService } from './app-settings.service';
import { AppSettingsController } from './app-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppSettings } from '../../database/entities/app-settings/app-setting.entity';
import { UsersService } from '@modules/users/users.service';
@Module({
  imports: [TypeOrmModule.forFeature([AppSettings])],
  controllers: [AppSettingsController],
  providers: [AppSettingsService, UsersService],
  exports: [AppSettingsService, UsersService],
})
export class AppSettingsModule {}
