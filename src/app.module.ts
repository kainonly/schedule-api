import { FastifyInstance } from 'fastify';
import { StorageService } from './common/storage.service';
import { JobsService } from './common/jobs.service';
import { api } from './router/api';

export class AppModule {
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
    this.jobs = new JobsService();
    this.storage = new StorageService(this.fastify);
  }

  /**
   * Init
   */
  onInit() {
    this.storage.get('jobs').then((response: any) => {
      if (response === null) {
        return;
      }
      const { data } = response;
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this.jobs.put(data[key]);
        }
      }
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Set Route
   */
  setRoute() {
    api(this.fastify, this.jobs, this.storage);
  }

  /**
   * On Event Change
   */
  onChange() {
    this.jobs.runtime.on('default', (data) => {
      this.storage.logging({
        type: 'run',
        identity: data.identity,
        output: data.output,
        status: true,
        create_time: (new Date()).getTime(),
      });
    });
    this.jobs.runtime.on('errors', (data) => {
      this.storage.logging({
        type: 'error',
        identity: data.identity,
        output: data.output,
        status: true,
        create_time: (new Date()).getTime(),
      });
    });
  }
}
