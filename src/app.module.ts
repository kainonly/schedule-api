import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JobsService } from './service/jobs.service';
import { StorageService } from './service/storage.service';
import { ConfigService } from './service/config.service';

@Module({
  controllers: [
    AppController,
  ],
  providers: [
    ConfigService,
    JobsService,
    StorageService,
  ],
})
export class AppModule {
}
