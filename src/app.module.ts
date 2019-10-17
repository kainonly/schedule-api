import { FastifyInstance } from 'fastify';
import { EventEmitter } from 'events';
import * as got from 'got';
import { env } from 'process';
import { ConfigService } from './common/config.service';
import { TasksService } from './common/tasks.service';
import { LogsService } from './common/logs.service';
import { TaskOptions } from './types/task-options';
import { api } from './router/api';

export class AppModule {
  private events: EventEmitter = new EventEmitter();
  private config: ConfigService;
  private tasks: TasksService;
  private logs: LogsService;

  static footRoot(fastify: FastifyInstance, options: any, done: any): void {
    const app = new AppModule(fastify);
    app.setProviders();
    app.onInit();
    app.setRoute();
    done();
  }

  constructor(
    private fastify: FastifyInstance,
  ) {
  }

  /**
   * Set Providers
   */
  setProviders() {
    this.config = new ConfigService(__dirname);
    this.tasks = new TasksService(this.events);
    this.logs = new LogsService(
      this.fastify,
      env.ELASTIC_INDEX ? env.ELASTIC_INDEX : 'schedule-service',
    );
  }

  /**
   * Init
   */
  onInit() {
    const configs = this.config.get();
    for (const key in configs) {
      if (configs.hasOwnProperty(key)) {
        this.tasks.put(configs[key]);
      }
    }
    this.events.on('tick', async (options: TaskOptions) => {
      try {
        const response = await got.post(options.url, {
          json: true,
          headers: options.headers,
          body: options.body,
        });
        this.logs.add({
          type: 'success',
          identity: options.identity,
          url: response.requestUrl,
          headers: response.headers,
          body: response.body,
          time: (new Date()).getTime(),
        });
      } catch (e) {
        this.logs.add({
          type: 'error',
          identity: options.identity,
          message: e.message,
          time: (new Date()).getTime(),
        });
      }
    });
  }

  /**
   * Set Route
   */
  setRoute() {
    api(this.fastify, this.tasks, this.config, this.logs);
  }
}
