import { FastifyInstance } from 'fastify';

const route = (fastify: FastifyInstance, options: any, done: any): void => {
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
  }, (request, reply) => {
    const body = request.body;
    reply.send({
      error: 0,
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
  }, (request, reply) => {
    const body = request.body;
    reply.send({
      error: 0,
    });
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
  }, (request, reply) => {
    const body = request.body;
    reply.send({
      error: 0,
    });
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
  }, (request, reply) => {
    const body = request.body;
    reply.send({
      error: 0,
    });
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
  }, (request, reply) => {
    const body = request.body;
    reply.send({
      error: 0,
    });
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
  }, (request, reply) => {
    const body = request.body;
    reply.send({
      error: 0,
    });
  });
  done();
};

export { route };
