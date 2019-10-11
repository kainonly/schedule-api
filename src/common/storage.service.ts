import { FastifyInstance } from 'fastify';
import { LogParam } from '../types/log-param';
import { Client } from '@elastic/elasticsearch';

export class StorageService {
  private client: Client;

  constructor(
    private readonly fastify: FastifyInstance,
  ) {
    this.client = fastify.elastic;
  }

  /**
   * Get Data
   * @param key
   */
  async get(key: string) {
    try {
      return await this.client.get(key);
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
   * @param create_time
   * @param limit
   * @param skip
   */
  async find(type: string, identity: string, create_time: any, limit: number, skip: number) {
    const doc = await this.database.find({
      selector: {
        type,
        identity,
        create_time,
      },
      sort: [{
        create_time: 'desc',
      }],
      limit,
      skip,
    });
    return {
      lists: doc.docs,
    };
  }
}
