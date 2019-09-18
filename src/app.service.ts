import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';

@Injectable()
export class AppService {
  private runtime: Map<string, any> = new Map<string, any>();
  private jobs: Map<string, CronJob> = new Map<string, CronJob>();

  get(identity: string): any {
    if (!this.runtime.has(identity)) {
      return false;
    }
    const job = this.jobs.get(identity);
    return Object.assign(this.runtime.get(identity), {
      running: job.running,
      nextDate: job.nextDate(),
      lastDate: job.lastDate(),
    });
  }
}
