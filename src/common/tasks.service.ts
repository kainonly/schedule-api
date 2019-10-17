import { CronJob } from 'cron';
import { EventEmitter } from 'events';
import { TaskOptions } from '../types/task-options';

export class TasksService {
  private tasks: { [key: string]: TaskOptions } = {};
  private cronJobs: Map<string, CronJob> = new Map<string, CronJob>();

  constructor(
    private events: EventEmitter,
  ) {
  }

  /**
   * get tasks
   */
  getTasks() {
    return this.tasks;
  }

  /**
   * get job information for the task
   * @param identity
   */
  get(identity: string): any {
    if (!this.cronJobs.has(identity)) {
      return false;
    }
    const cronJob = this.cronJobs.get(identity);
    return Object.assign(this.tasks[identity], {
      running: cronJob.running,
      nextDate: cronJob.nextDate(),
      lastDate: cronJob.lastDate(),
    });
  }

  /**
   * Add or update job information for task
   * @param options
   */
  put(options: TaskOptions) {
    if (this.tasks.hasOwnProperty(options.identity)) {
      this.delete(options.identity);
    }
    Reflect.set(this.tasks, options.identity, options);
    const cronJob = new CronJob(options.cron_time, () => {
      this.events.emit('tick', options);
    }, null, options.start, options.time_zone);
    this.cronJobs.set(options.identity, cronJob);
    return (
      this.tasks.hasOwnProperty(options.identity) &&
      this.cronJobs.has(options.identity)
    );
  }

  /**
   * Stop and delete the task
   * @param identity
   */
  delete(identity: string): boolean {
    if (!this.cronJobs.has(identity)) {
      return true;
    }
    this.cronJobs.get(identity).stop();
    return (
      this.cronJobs.delete(identity) &&
      Reflect.deleteProperty(this.tasks, identity)
    );
  }

  /**
   * start the task
   * @param identity
   */
  start(identity: string): boolean {
    if (!this.cronJobs.has(identity)) {
      return false;
    }
    const cronJob = this.cronJobs.get(identity);
    cronJob.start();
    return cronJob.running;
  }

  /**
   * stop the task
   * @param identity
   */
  stop(identity: string): boolean {
    if (!this.cronJobs.has(identity)) {
      return false;
    }
    const cronJob = this.cronJobs.get(identity);
    cronJob.stop();
    return cronJob.running;
  }
}
