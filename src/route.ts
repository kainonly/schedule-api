import { FastifyInstance } from 'fastify';
import { StorageService } from './common/storage.service';
import { JobsService } from './common/jobs.service';

const route = (fastify: FastifyInstance, options: any, done: any): void => {
  const storage = new StorageService(fastify);
  const jobs = new JobsService();

  jobs.runtime.on('default', (data) => {
    console.log(data);
  });

  jobs.runtime.on('errors', (data) => {
    console.log(data);
  });

  async function temporaryJobs() {
    return await storage.add('jobs', {
      data: jobs.getJobs(),
    });
  }

  /**
   * Get Jobs Lists
   */
  fastify.post('/lists', {
    schema: {
      body: {
        required: ['identity'],
        properties: {
          identity: {
            type: 'array',
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body;
    reply.send({
      error: 0,
      data: body.identity.map((v: any) => jobs.get(v)),
    });
  });
  /**
   * Get Job
   */
  fastify.post('/get', {
    schema: {
      body: {
        required: ['identity'],
        properties: {
          identity: {
            type: 'string',
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body;
    const result = jobs.get(body.identity);
    if (result) {
      reply.send({
        error: 0,
        data: result,
      });
    } else {
      reply.send({
        error: 1,
        msg: 'not exists',
      });
    }
  });
  /**
   * Put Job
   */
  fastify.post('/put', {
    schema: {
      body: {
        required: ['identity', 'time', 'bash', 'start', 'zone'],
        properties: {
          identity: {
            type: 'string',
          },
          time: {
            type: 'string',
          },
          bash: {
            type: 'string',
          },
          start: {
            type: 'boolean',
          },
          zone: {
            type: 'string',
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body;
    const result: boolean = jobs.put(body);
    const response = await storage.logging({
      type: 'put',
      identity: body.identity,
      response: body,
      status: result,
      create_time: (new Date()).getTime(),
    });
    const runtime: any = await temporaryJobs();
    if (result && response.ok && runtime.ok) {
      reply.send({
        error: 0,
        msg: 'ok',
      });
    } else {
      reply.send({
        error: 1,
        msg: 'failed',
      });
    }
  });
  /**
   * Delete Job
   */
  fastify.post('/delete', {
    schema: {
      body: {
        required: ['identity'],
        properties: {
          identity: {
            type: 'string',
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body;
    const result: boolean = jobs.delete(body.identity);
    const response = await storage.logging({
      type: 'delete',
      identity: body.identity,
      response: body,
      status: result,
      create_time: (new Date()).getTime(),
    });
    const runtime: any = await temporaryJobs();
    if (result && response.ok && runtime.ok) {
      reply.send({
        error: 0,
        msg: 'ok',
      });
    } else {
      reply.send({
        error: 1,
        msg: 'failed',
      });
    }
  });
  /**
   * Change Job Status
   */
  fastify.post('/status', {
    schema: {
      body: {
        required: ['identity', 'status'],
        properties: {
          identity: {
            type: 'string',
          },
          status: {
            type: 'boolean',
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body;
    if (body.status) {
      jobs.start(body.identity);
    } else {
      jobs.stop(body.identity);
    }
    const response = await storage.logging({
      type: 'status',
      identity: body.identity,
      response: body,
      status: true,
      create_time: (new Date()).getTime(),
    });
    if (response.ok) {
      reply.send({
        error: 0,
        msg: 'ok',
      });
    } else {
      reply.send({
        error: 1,
        msg: 'failed',
      });
    }
  });
  /**
   * Get Logging Data
   */
  fastify.post('/logging', {
    schema: {
      body: {
        required: ['type', 'identity', 'limit', 'skip'],
        properties: {
          type: {
            type: 'string',
            enum: ['put', 'delete', 'status', 'run'],
          },
          identity: {
            type: 'string',
          },
          limit: {
            type: 'number',
            minimum: 1,
            maximum: 50,
          },
          skip: {
            type: 'number',
            minimum: 1,
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body;
    const lists = await this.storageService.find(
      body.type,
      body.identity,
      body.limit,
      body.skip,
    );
    reply.send({
      error: 0,
      data: {
        lists,
      },
    });
  });
  done();
};

export { route };
