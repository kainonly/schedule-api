import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CronJob } from 'cron';
import { TaskService } from '../database/task.service';

@Injectable()
export class CronService implements OnApplicationBootstrap {
  private client: Map<any, CronJob> = new Map();

  constructor(
    private taskService: TaskService,
  ) {
  }

  async onApplicationBootstrap() {
    // const data = await this.scheduleRepository.repository.find({
    //   status: 1,
    // });
    // for (const x of data) {
    //   this.client.set(x.id, new CronJob(x.rule, () => {
    //     // Log
    //   }, null, true));
    // }
  }
}
