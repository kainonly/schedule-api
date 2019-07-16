import { Column, Entity, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('task')
export class TaskEntity {
  @ObjectIdColumn()
  id?: ObjectID;

  @Column()
  job_name: string;

  @Column()
  rule: string;

  @Column()
  time_zone: string;

  @Column()
  status?: boolean;

  @Column()
  create_time: Date;

  @Column()
  update_time: Date;
}
