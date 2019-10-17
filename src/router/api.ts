import { FastifyInstance } from 'fastify';
import { findTimeZone } from 'timezone-support';
import { TasksService } from '../common/tasks.service';
import { LogsService } from '../common/logs.service';
import { ConfigService } from '../common/config.service';

const api = (fastify: FastifyInstance, tasks: TasksService, config: ConfigService, logs: LogsService) => {
  /**
   * Temporary synchronization task
   */
  function temporaryTasks() {
    config.set(tasks.getTasks());
  }

  /**
   * Get the identity of all tasks
   */
  fastify.post('/all', async (request, reply) => {
    const identity = [];
    const tasksObjects = tasks.getTasks();
    for (const key in tasksObjects) {
      if (tasksObjects.hasOwnProperty(key)) {
        identity.push(key);
      }
    }
    reply.send({
      error: 0,
      data: identity,
    });
  });
  /**
   * Get a list of job information for the task identity
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
      data: body.identity.map((v: any) => tasks.get(v)),
    });
  });
  /**
   * Get a job information for the task identity
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
    const result = tasks.get(body.identity);
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
   * Update or create a task to automatically request execution services
   */
  fastify.post('/put', {
    schema: {
      body: {
        required: ['identity', 'cron_time', 'url', 'time_zone'],
        properties: {
          identity: {
            type: 'string',
          },
          cron_time: {
            type: 'string',
          },
          url: {
            type: 'string',
          },
          headers: {
            type: 'object',
          },
          body: {
            type: 'object',
          },
          start: {
            type: 'boolean',
          },
          time_zone: {
            type: 'string',
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body;
    if (body.cron_time.split(' ').filter(v => v !== '').length !== 6) {
      reply.send({
        error: 1,
        msg: 'Cron job failures can be disastrous!',
      });
      return;
    }
    Reflect.set(body, 'start', body.start ? body.start : true);
    findTimeZone(body.time_zone);
    const result: boolean = tasks.put(body);
    const response = await logs.add({
      type: 'put',
      identity: body.identity,
      body,
      action: result,
      time: (new Date()).getTime(),
    });
    if (result && response.statusCode === 201) {
      temporaryTasks();
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
   * Stop and delete the task
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
    const result: boolean = tasks.delete(body.identity);
    const response = await logs.add({
      type: 'delete',
      identity: body.identity,
      body,
      action: result,
      time: (new Date()).getTime(),
    });
    if (result && response.statusCode === 201) {
      temporaryTasks();
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
   * Change the job running status of the task
   */
  fastify.post('/running', {
    schema: {
      body: {
        required: ['identity', 'running'],
        properties: {
          identity: {
            type: 'string',
          },
          running: {
            type: 'boolean',
          },
        },
      },
    },
  }, async (request, reply) => {
    const body = request.body;
    if (body.running) {
      tasks.start(body.identity);
    } else {
      tasks.stop(body.identity);
    }
    const response = await logs.add({
      type: 'running',
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
   * Query the log related to the acquisition task
   */
  fastify.post('/search', {
    schema: {
      body: {
        required: ['identity', 'time', 'limit', 'skip'],
        properties: {
          type: {
            type: 'string',
            enum: ['put', 'delete', 'running', 'success', 'error'],
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
   * Clear all logs for a task
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
