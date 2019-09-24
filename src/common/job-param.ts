import { Moment } from 'moment';

export interface JobParam {
  identity: string;
  time: string | Date | Moment;
  bash: string;
  start: boolean;
  zone: string;
}
