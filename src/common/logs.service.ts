import { FastifyInstance } from 'fastify';
import { Client } from '@elastic/elasticsearch';

export class LogsService {
  private client: Client;

  constructor(
    private readonly fastify: FastifyInstance,
    private index: string,
  ) {
    this.client = fastify.elastic;
  }

  /**
   * Add Log Data
   */
  async add(data: any) {
    return await this.client.index({
      index: this.index,
      body: data,
    });
  }

  /**
   * Search Log Data
   */
  async search(type: string, identity: string, time: any, limit: number, skip: number) {
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
    if (time) {
      query.bool.must.push({
        range: {
          time,
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
          time: {
            order: 'desc',
          },
        },
      },
    });
  }
}
