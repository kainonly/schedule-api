import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { execSync } from 'child_process';
import { JobsParams } from '../common/jobs-params';

@Injectable()
export class JobsService {
  private runtime: { [key: string]: JobsParams } = {};
  private jobs: Map<string, CronJob> = new Map<string, CronJob>();

  /**
   * get runtime map
   */
  getRunTime() {
    return this.runtime;
  }

  /**
   * get job
   * @param identity
   */
  get(identity: string): any {
    if (!this.jobs.has(identity)) {
      return false;
    }
    const job = this.jobs.get(identity);
    return Object.assign(this.runtime.hasOwnProperty(identity), {
      running: job.running,
      nextDate: job.nextDate(),
      lastDate: job.lastDate(),
    });
  }

  /**
   * add or update job
   * @param jobsParams
   */
  put(jobsParams: JobsParams) {
    if (this.runtime.hasOwnProperty(jobsParams.identity)) {
      this.delete(jobsParams.identity);
    }
    this.runtime[jobsParams.identity] = jobsParams;
    const cronJob = new CronJob(jobsParams.time, () => {
      try {
        const output = execSync(jobsParams.bash);
      } catch (e) {
        console.log(e);
      }
    }, null, jobsParams.start, jobsParams.zone);
    this.jobs.set(jobsParams.identity, cronJob);
    return this.runtime.hasOwnProperty(jobsParams.identity) && this.jobs.has(jobsParams.identity);
  }

  /**
   * delete job
   * @param identity
   */
  delete(identity: string): boolean {
    if (!this.jobs.has(identity)) {
      return true;
    }
    this.jobs.get(identity).stop();
    return (
      this.jobs.delete(identity) &&
      Reflect.deleteProperty(this.runtime, identity)
    );
  }

  /**
   * start job
   * @param identity
   */
  start(identity: string): boolean {
    if (!this.jobs.has(identity)) {
      return false;
    }
    const job = this.jobs.get(identity);
    job.start();
    return job.running;
  }

  /**
   * stop job
   * @param identity
   */
  stop(identity: string): boolean {
    if (!this.jobs.has(identity)) {
      return false;
    }
    const job = this.jobs.get(identity);
    job.stop();
    return job.running;
  }
}
