import { FastifyInstance } from 'fastify';
import { join } from 'path';
import { StorageService } from './common/storage.service';
import { JobsService } from './common/jobs.service';
import { api } from './router/api';

import { ConfigService } from './common/config.service';

export class AppModule {
  private config: ConfigService;
  private jobs: JobsService;
  private storage: StorageService;

  static footRoot(fastify: FastifyInstance, options: any, done: any): void {
    const app = new AppModule(fastify);
    app.setProviders();
    app.onInit();
    app.setRoute();
    app.onChange();
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
    this.config = new ConfigService(join(__dirname, 'data', 'config.json'));
    this.jobs = new JobsService();
    this.storage = new StorageService(this.fastify, 'schedule-service');
  }

  /**
   * Init
   */
  onInit() {
    const configs = this.config.get();
    for (const key in configs) {
      if (configs.hasOwnProperty(key)) {
        this.jobs.put(configs[key]);
      }
    }
  }

  /**
   * Set Route
   */
  setRoute() {
    api(this.fastify, this.jobs, this.config, this.storage);
  }

  /**
   * On Event Change
   */
  onChange() {
    this.jobs.runtime.on('default', (data) => {
      this.storage.add({
        type: 'run',
        identity: data.identity,
        output: data.output,
        status: true,
        create_time: (new Date()).getTime(),
      });
    });
    this.jobs.runtime.on('errors', (data) => {
      this.storage.add({
        type: 'error',
        identity: data.identity,
        output: data.output,
        status: true,
        create_time: (new Date()).getTime(),
      });
    });
  }
}
