import { Module } from '@nestjs/common';
import { AppModelModule } from './app-model.module';
import { MainController } from './controller/main.controller';
import { CronService } from './common/cron.service';
import { ScheduleController } from './controller/schedule.controller';

@Module({
  imports: [
    AppModelModule,
  ],
  controllers: [
    MainController,
    ScheduleController,
  ],
  providers: [
    CronService,
  ],
})
export class AppModule {
}
