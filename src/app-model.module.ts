import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './database/task.entity';
import { TaskService } from './database/task.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({}),
    TypeOrmModule.forFeature([
      TaskEntity,
    ]),
  ],
  providers: [
    TaskService,
  ],
  exports: [
    TaskService,
  ],
})
export class AppModelModule {
}
