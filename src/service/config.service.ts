import { Injectable } from '@nestjs/common';
import { env } from 'process';
import { dirname, join } from 'path';

@Injectable()
export class ConfigService {
  schduleLogs: string;

  constructor() {
    this.schduleLogs = join(dirname(__dirname), env.SCHEDULE_LOGS);
  }
}
