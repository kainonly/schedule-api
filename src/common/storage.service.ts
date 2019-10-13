import { FastifyInstance } from 'fastify';
import { Client } from '@elastic/elasticsearch';
import { LogParam } from '../types/log-param';

export class StorageService {
  private client: Client;

  constructor(
    private readonly fastify: FastifyInstance,
    private index: string,
  ) {
    this.client = fastify.elastic;
  }

  async add(logs: LogParam) {
    return await this.client.index({
      index: this.index,
      body: {
        type: logs.type,
        identity: logs.identity,
        output: logs.output,
        create_time: logs.create_time,
      },
    });
  }

  async search(type: string, identity: string, create_time: any, limit: number, skip: number) {
    const query = {
      bool: {
        must: [],
      },
    };
    if (type) {
      query.bool.must.push({
        match: {
          type,
        },
      });
    }
    if (identity) {
      query.bool.must.push({
        match: {
          identity,
        },
      });
    }
    if (create_time) {
      query.bool.must.push({
        range: {
          create_time,
        },
      });
    }
    return await this.client.search({
      index: this.index,
      body: {
        query,
        size: limit,
        from: skip,
        sort: {
          create_time: {
            order: 'desc',
          },
        },
      },
    });
  }
}
