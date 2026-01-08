import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './shared/auth/auth.module';
import { TypeOrmModule } from './config/datasource';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReferenceImageModule } from './modules/reference-images/reference-images.module';
import { MedicationModule } from './modules/medications/medications.module';
import { RecognitionModule } from './modules/recognitions/recognitions.module';
import { FoodItemsModule } from './modules/food-items/food-items.module';
import { feedbacksModule } from './modules/feedbacks/feedbacks.module';
import { GoalModule } from './modules/goals/goals.module';
import { FoodRecomendationsModule } from './modules/food-recomendations/food-recomendations.module';
import { DietaryRoutineModule } from './modules/dietary-routines/dietary-routines.module';
import { ClinicalProfilesModule } from './modules/clinical-profiles/clinical-profiles.module';
import { DiabeteProfilesModule } from './modules/diabeti-profiles/diabeti-profiles.module';
import { AssociatedConditionsModule } from './modules/associated-conditions/associated-conditions.module';
import { AppSettingsModule } from './modules/app-settings/app-settings.module';
import { AllergiesModule } from './modules/allergies/allergies.module';
import { VisionModule } from './modules/vision/vision.module';
import { EmailModule } from 'shared/email/email.module';
import { MedicationSchedule } from '@database/entities/medication-schedules/medication-schedules.entity';
import { FoodDataModule } from '@modules/food-data/food-data.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '.upload'), // Pasta onde as imagens estão
      serveRoot: '/uploads', // Define a rota para acessar os arquivos
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 25,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 50,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    AllergiesModule,
    AuthModule,
    UsersModule,
    NotificationsModule,
    ReferenceImageModule,
    MedicationModule,
    RecognitionModule,
    FoodItemsModule,
    feedbacksModule,
    GoalModule,
    FoodRecomendationsModule,
    DietaryRoutineModule,
    ClinicalProfilesModule,
    DiabeteProfilesModule,
    AssociatedConditionsModule,
    AppSettingsModule,
    VisionModule,
    EmailModule,
    MedicationSchedule,
    FoodDataModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(private readonly datasource: DataSource) {}
}
