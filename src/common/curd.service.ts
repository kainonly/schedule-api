import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScriptTaskEntity } from '../database/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CurdService {
  constructor(
    @InjectRepository(ScriptTaskEntity)
    public readonly task: Repository<ScriptTaskEntity>,
  ) {
  }
}
