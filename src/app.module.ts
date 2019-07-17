import { Module } from '@nestjs/common';
import { CronService } from './common/cron.service';
import { CurdService } from './common/curd.service';

import { MainController } from './app/main.controller';
import { TaskController } from './app/task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './database/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({}),
    TypeOrmModule.forFeature([
      TaskEntity,
    ]),
  ],
  controllers: [
    MainController,
    TaskController,
  ],
  providers: [
    CurdService,
    CronService,
  ],
})
export class AppModule {
}
