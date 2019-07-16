import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    public repository: Repository<TaskEntity>,
  ) {
  }
}
