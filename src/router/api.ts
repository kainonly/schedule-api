import { FastifyInstance } from 'fastify';
import { JobsService } from '../common/jobs.service';
import { LogsService } from '../common/logs.service';
import { ConfigService } from '../common/config.service';

const api = (fastify: FastifyInstance, jobs: JobsService, config: ConfigService, logs: LogsService) => {
  /**
   * Temporary Jobs Storage
   */
  function temporaryJobs() {
    config.set(jobs.getJobs());
  }

  /**
   * Get All Identity
   */
  fastify.post('/all', async (request, reply) => {
    const identity = [];
    for (const key in jobs.getJobs()) {
      if (jobs.getJobs().hasOwnProperty(key)) {
        identity.push(key);
      }
    }
    reply.send({
      error: 0,
      data: identity,
    });
  });
  /**
   * Lists Jobs
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
    const response = await logs.add({
      type: 'put',
      identity: body.identity,
      body,
      status: result,
      time: (new Date()).getTime(),
    });
    temporaryJobs();
    if (result && response.statusCode === 201) {
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
    const response = await logs.add({
      type: 'delete',
      identity: body.identity,
      body,
      status: result,
      time: (new Date()).getTime(),
    });
    temporaryJobs();
    if (result && response.statusCode === 201) {
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
    const response = await logs.add({
      type: 'status',
      identity: body.identity,
      body,
      time: (new Date()).getTime(),
    });
    if (response.statusCode === 201) {
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
   * Get Logging
   */
  fastify.post('/search', {
    schema: {
      body: {
        required: ['identity', 'time', 'limit', 'skip'],
        properties: {
          type: {
            type: 'string',
            enum: ['put', 'delete', 'status', 'run', 'error'],
          },
          identity: {
            type: 'string',
          },
          create_time: {
            type: 'object',
          },
          limit: {
            type: 'number',
            minimum: 1,
            maximum: 50,
          },
          skip: {
            type: 'number',
            minimum: 0,
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body;
    const response = await logs.search(
      body.type,
      body.identity,
      body.time,
      body.limit,
      body.skip,
    );
    reply.send({
      error: 0,
      data: response.body,
    });
  });
  /**
   * Clear logging
   */
  fastify.post('/clear', {
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
    const response = await logs.clear(body.identity);
    if (response.statusCode === 200) {
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
};

export { api };
