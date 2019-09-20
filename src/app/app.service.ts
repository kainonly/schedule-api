import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import * as process from 'process';
import { execSync } from 'child_process';
import { Runtime } from '../types/runtime';

@Injectable()
export class AppService {
  private runtime: Map<string, Runtime> = new Map<string, Runtime>();
  private jobs: Map<string, CronJob> = new Map<string, CronJob>();

  constructor() {
    process.on('exit', () => {
      console.log(this.runtime);
      console.log(this.jobs);
    });
  }

  create(runtime: Runtime) {
    this.runtime.set(runtime.identity, runtime);
    const cronJob = new CronJob(runtime.cronTime, () => {
      console.log('asdas');
      // try {
      //   console.log(runtime.identity);
      //   const output = execSync(runtime.bash);
      //   console.log(output);
      // } catch (e) {
      //   console.log(e);
      // }
    }, null, runtime.start, runtime.timeZone);
    this.jobs.set(runtime.identity, cronJob);
    return this.runtime.has(runtime.identity) && this.jobs.has(runtime.identity);
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
