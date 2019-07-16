import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('task')
export class TaskEntity {
  @ObjectIdColumn()
  _id?: ObjectID;

  @Column()
  job_name: string;

  @Column()
  cron: string;

  @Column('boolean', {
    default: true,
  })
  status: boolean;

  @Column()
  create_time: Date;

  @Column()
  update_time: Date;
}
