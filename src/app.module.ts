import { Module } from '@nestjs/common';
import { DbModule } from './database/db.module';

import { FacadeService } from './common/facade.service';
import { DbService } from './common/db.service';
import { CronService } from './common/cron.service';

import { MainController } from './api/main.controller';
import { ScriptTaskController } from './api/script-task.controller';
import { ApiTaskController } from './api/api-task.controller';

@Module({
  imports: [
    DbModule,
  ],
  controllers: [
    MainController,
    ScriptTaskController,
    ApiTaskController,
  ],
  providers: [
    DbService,
    FacadeService,
    CronService,
  ],
})
export class AppModule {
}
