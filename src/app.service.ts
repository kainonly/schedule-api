import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';

@Injectable()
export class AppService {
  private runtime: Map<string, any> = new Map<string, any>();
  private jobs: Map<string, CronJob> = new Map<string, CronJob>();

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
