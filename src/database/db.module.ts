import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScriptTask } from './entity/script-task';
import { Task } from './entity/api-task';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([
      ScriptTask,
      Task,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {
}
