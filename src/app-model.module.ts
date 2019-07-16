import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './database/task.entity';
import { Task } from './database/task.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({}),
    TypeOrmModule.forFeature([
      TaskEntity,
    ]),
  ],
  providers: [
    Task,
  ],
  exports: [
    Task,
  ],
})
export class AppModelModule {
}
