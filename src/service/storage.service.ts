import { Injectable } from '@nestjs/common';
import { LogsParams } from '../common/logs-params';
import * as PouchDB from 'pouchdb';

@Injectable()
export class StorageService {
  private database: PouchDB.Database;

  constructor() {
    this.database = new PouchDB('../schedule-logs', {
      adapter: 'leveldb',
    });
  }

  /**
   * Get Data
   * @param key
   */
  async get(key: string) {
    try {
      return await this.database.get(key);
    } catch (e) {
      if (e.message === 'missing') {
        return null;
      } else {
        console.log(e);
      }
    }
  }

  /**
   * Add Data
   * @param key
   * @param value
   */
  async add(key: string, value: any) {
    try {
      const doc = await this.database.get(key);
      return await this.database.put(Object.assign({
        _id: key,
        _rev: doc._rev,
      }, value));
    } catch (e) {
      if (e.message === 'missing') {
        return await this.database.post(value);
      } else {
        console.log(e);
      }
    }
  }

  /**
   * Logging Data
   * @param logs
   */
  async logging(logs: LogsParams) {
    try {
      return await this.database.post({
        type: logs.type,
        raws: logs.raws,
        createTime: logs.createTime,
      });
    } catch (e) {
      console.log(e);
    }
  }
}