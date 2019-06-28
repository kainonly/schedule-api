import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { ScheduleRepository } from '../repository/schedule.repository';

@Injectable()
export class CronService {
  private client: Map<string, CronJob> = new Map();

  constructor(
    private scheduleRepository: ScheduleRepository,
  ) {
    this.scheduleRepository.repository.find().then(data => {
      console.log(data);
    });
    // const x = new CronJob('* * * * * *', () => {
    //   // tslint:disable-next-line:no-console
    //   console.log('RUN');
    // }, null, true, 'Asia/Shanghai');
  }
}
