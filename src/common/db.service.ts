import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CurdFactory } from './curd.factory';

@Injectable()
export class DbService {
  static Curd(repository: Repository<any>) {
    return new CurdFactory(repository);
  }

  constructor(
    @InjectConnection()
    public readonly connection: Connection,
  ) {
  }
}
