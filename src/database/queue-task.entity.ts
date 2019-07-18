import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('queue_task')
export class QueueTaskEntity {
  @ObjectIdColumn()
  _id?: ObjectID;

  @Column()
  job_name: string;

  @Column()
  user: string;

  @Column()
  time_out: number;

  @Column()
  retry: number;

  @Column()
  interval: number;

  @Column()
  exclude_node: string[];

  @Column()
  cron: string[];

  @Column()
  status: boolean;

  @Column()
  create_time: Date;

  @Column()
  update_time: Date;
}
