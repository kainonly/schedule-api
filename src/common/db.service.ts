import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurdFactory } from './curd.factory';
import { ScriptTaskEntity } from '../database/script-task.entity';
import { ApiTaskEntity } from '../database/api-task.entity';
import { QueueTaskEntity } from '../database/queue-task.entity';

@Injectable()
export class DbService {
  static Curd(repository: Repository<any>) {
    return new CurdFactory(repository);
  }

  constructor(
    @InjectRepository(ScriptTaskEntity)
    public readonly scriptTask: Repository<ScriptTaskEntity>,
    @InjectRepository(ApiTaskEntity)
    public readonly apiTask: Repository<ApiTaskEntity>,
    @InjectRepository(QueueTaskEntity)
    public readonly queueTask: Repository<QueueTaskEntity>,
  ) {
  }

}
