import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../database/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CurdService {
  constructor(
    @InjectRepository(TaskEntity)
    public readonly task: Repository<TaskEntity>,
  ) {
  }
}
