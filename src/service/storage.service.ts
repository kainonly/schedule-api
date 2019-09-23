import { Injectable } from '@nestjs/common';
import * as PouchDB from 'pouchdb';
import * as uuid from 'uuid/v4';
import { LogsParams } from '../common/logs-params';

@Injectable()
export class StorageService {
  private database: PouchDB.Database;

  constructor() {
    this.database = new PouchDB('../schedule-logs');
    console.log(this.database);
  }

  async add(params: LogsParams) {
    try {
      return await this.database.put({
        _id: uuid(),
        type: params.type,
        raws: params.raws,
        createTime: params.createTime,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
