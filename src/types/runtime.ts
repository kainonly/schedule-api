import { Moment } from 'moment';

export interface Runtime {
  identity: string;
  cronTime: string | Date | Moment;
  bash: string;
  start?: boolean;
  timeZone?: string;
}
