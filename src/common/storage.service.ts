import { FastifyInstance } from 'fastify';
import * as PouchDB from 'pouchdb';
import { LogParam } from '../types/log-param';

export class StorageService {
  private database: PouchDB.Database;

  constructor(
    private readonly fastify: FastifyInstance,
  ) {
    this.database = fastify.pouchdb;
    this.database.createIndex({
      index: {
        fields: ['type', 'identity'],
        name: 'logging',
        ddoc: 'logging',
        type: 'json',
      },
    }).then(response => {
      if (response.result === 'created') {
        console.debug('index create success!');
      }
    }).catch(error => {
      console.log(error);
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
        return false;
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
      const data = Object.assign({
        _id: key,
        _rev: doc._rev,
      }, value);
      return await this.database.put(data);
    } catch (e) {
      if (e.message === 'missing') {
        return await this.database.put(Object.assign({
          _id: key,
        }, value));
      } else {
        return false;
      }
    }
  }

  /**
   * Logging Data
   * @param logs
   */
  async logging(logs: LogParam) {
    return await this.database.post({
      type: logs.type,
      identity: logs.identity,
      output: logs.output,
      create_time: logs.create_time,
    });
  }

  /**
   * Find Logs
   * @param type
   * @param identity
   * @param limit
   * @param skip
   */
  async find(type: string, identity: string, limit: number, skip: number) {
    return await this.database.find({
      selector: {
        type,
        identity,
      },
      limit,
      skip,
      use_index: 'logging',
    });
  }
}
