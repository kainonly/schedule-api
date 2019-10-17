export interface TaskOptions {
  identity: string;
  cron_time: string;
  url: string;
  headers?: any;
  body?: any;
  start?: boolean;
  time_zone: string;
}
