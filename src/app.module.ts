import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JobsService } from './service/jobs.service';
import { StorageService } from './service/storage.service';

@Module({
  controllers: [
    AppController,
  ],
  providers: [
    JobsService,
    StorageService,
  ],
})
export class AppModule {
}
