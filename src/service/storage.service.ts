import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid/v4';
import { LogsParams } from '../common/logs-params';

@Injectable()
export class StorageService {
  constructor() {
  }

  async get(id: any): Promise<any> {
    try {
      return await this.database.get(id);
    } catch (err) {
      console.log(err);
    }
  }

  async add(params: any) {
    try {
      return await this.database.put(params);
    } catch (err) {
      console.log(err);
    }
  }

  async push(params: LogsParams) {
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
