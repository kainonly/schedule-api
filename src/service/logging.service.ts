import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class LoggingService {
  push(data: any) {
    fs.appendFileSync('./logs/run', data);
  }
}
