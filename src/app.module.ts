import { Module } from '@nestjs/common';
import { AppModelModule } from './app-model.module';
import { CronService } from './common/cron.service';

import { MainController } from './app/main.controller';
import { TaskController } from './app/task.controller';

@Module({
  imports: [
    AppModelModule,
  ],
  controllers: [
    MainController,
    TaskController,
  ],
  providers: [
    CronService,
  ],
})
export class AppModule {
}
