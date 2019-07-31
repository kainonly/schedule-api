import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CurdFactory } from './curd.factory';
import { ScriptTask } from '../database/entity/script-task';
import { ApiTask } from '../database/entity/api-task';

@Injectable()
export class DbService {
  static Curd(repository: Repository<any>) {
    return new CurdFactory(repository);
  }

  constructor(
    @InjectConnection()
    public readonly connection: Connection,
    @InjectRepository(ScriptTask)
    public readonly scriptTask: Repository<ScriptTask>,
    @InjectRepository(ApiTask)
    public readonly apiTask: Repository<ApiTask>,
  ) {
  }
}
