import { Moment } from 'moment';

export interface JobsParams {
  identity: string;
  time: string | Date | Moment;
  bash: string;
  start: boolean;
  zone: string;
}
