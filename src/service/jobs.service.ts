import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import * as process from 'process';
import { execSync } from 'child_process';
import { JobsParams } from '../common/jobs-params';

@Injectable()
export class JobsService {
  private runtime: Map<string, JobsParams> = new Map<string, JobsParams>();
  private jobs: Map<string, CronJob> = new Map<string, CronJob>();

  constructor() {
    process.on('exit', () => {
      console.log(this.runtime);
      console.log(this.jobs);
    });
  }

  get(identity: string): any {
    if (!this.jobs.has(identity)) {
      return false;
    }
    const job = this.jobs.get(identity);
    return Object.assign(this.runtime.get(identity), {
      running: job.running,
      nextDate: job.nextDate(),
      lastDate: job.lastDate(),
    });
  }

  put(jobsParams: JobsParams) {
    if (this.runtime.has(jobsParams.identity)) {
      this.delete(jobsParams.identity);
    }
    this.runtime.set(jobsParams.identity, jobsParams);
    const cronJob = new CronJob(jobsParams.time, () => {
      try {
        const output = execSync(jobsParams.bash);
        console.log(output.toString());
      } catch (e) {
        console.log(e);
      }
    }, null, jobsParams.start, jobsParams.zone);
    this.jobs.set(jobsParams.identity, cronJob);
    return this.runtime.has(jobsParams.identity) && this.jobs.has(jobsParams.identity);
  }

  delete(identity: string): boolean {
    if (!this.jobs.has(identity)) {
      return true;
    }
    this.jobs.get(identity).stop();
    return (
      this.jobs.delete(identity) &&
      this.runtime.delete(identity)
    );
  }

  start(identity: string): boolean {
    if (!this.jobs.has(identity)) {
      return false;
    }
    const job = this.jobs.get(identity);
    job.start();
    return job.running;
  }

  stop(identity: string): boolean {
    if (!this.jobs.has(identity)) {
      return false;
    }
    const job = this.jobs.get(identity);
    job.stop();
    return job.running;
  }
}
