import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JobsService } from './service/jobs.service';

@Module({
  controllers: [AppController],
  providers: [JobsService],
})
export class AppModule {
}
