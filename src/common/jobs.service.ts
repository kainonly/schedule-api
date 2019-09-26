import { JobParam } from '../types/job-param';
import { CronJob } from 'cron';
import { execSync } from 'child_process';
import * as EventEmitter from 'events';

export class JobsService {
  runtime: EventEmitter = new EventEmitter();
  private jobs: { [key: string]: JobParam } = {};
  private cronJobs: Map<string, CronJob> = new Map<string, CronJob>();

  /**
   * get jobs objects
   */
  getJobs() {
    return this.jobs;
  }

  /**
   * get job
   * @param identity
   */
  get(identity: string): any {
    if (!this.cronJobs.has(identity)) {
      return false;
    }
    const job = this.cronJobs.get(identity);
    return Object.assign(this.jobs[identity], {
      running: job.running,
      nextDate: job.nextDate(),
      lastDate: job.lastDate(),
    });
  }

  /**
   * add or update job
   * @param jobParam
   */
  put(jobParam: JobParam) {
    if (this.jobs.hasOwnProperty(jobParam.identity)) {
      this.delete(jobParam.identity);
    }
    this.jobs[jobParam.identity] = jobParam;
    const cronJob = new CronJob(jobParam.time, () => {
      try {
        this.runtime.emit('default', {
          identity: jobParam.identity,
          output: execSync(jobParam.bash).toString(),
        });
      } catch (e) {
        this.runtime.emit('error', {
          identity: jobParam.identity,
          output: e.message,
        });
        this.stop(jobParam.identity);
      }
    }, null, jobParam.start, jobParam.zone);
    this.cronJobs.set(jobParam.identity, cronJob);
    return (
      this.jobs.hasOwnProperty(jobParam.identity)
      && this.cronJobs.has(jobParam.identity)
    );
  }

  /**
   * delete job
   * @param identity
   */
  delete(identity: string): boolean {
    if (!this.cronJobs.has(identity)) {
      return true;
    }
    this.cronJobs.get(identity).stop();
    return (
      this.cronJobs.delete(identity) &&
      Reflect.deleteProperty(this.jobs, identity)
    );
  }

  /**
   * start job
   * @param identity
   */
  start(identity: string): boolean {
    if (!this.cronJobs.has(identity)) {
      return false;
    }
    const job = this.cronJobs.get(identity);
    job.start();
    return job.running;
  }

  /**
   * stop job
   * @param identity
   */
  stop(identity: string): boolean {
    if (!this.cronJobs.has(identity)) {
      return false;
    }
    const job = this.cronJobs.get(identity);
    job.stop();
    return job.running;
  }
}
