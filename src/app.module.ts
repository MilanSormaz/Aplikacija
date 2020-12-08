import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { AdministratorController } from './controllers/api/administrator.controller';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3307,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Administrator

      ]

    }),
    TypeOrmModule.forFeature([Administrator])

  ],
  controllers: [
    AppController,
    AdministratorController
  ],
  providers: [AdministratorService]

})
export class AppModule {}
