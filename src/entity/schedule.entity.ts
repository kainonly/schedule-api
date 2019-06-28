import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schedule')
export class ScheduleEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id?: number;

  @Column('varchar', {
    length: 20,
    comment: 'Job Name',
  })
  job_name: string;

  @Column('varchar', {
    length: 50,
    comment: 'Cron Rule',
  })
  rule: string;

  @Column('varchar', {
    length: 20,
    comment: 'Time Zone',
  })
  time_zone: string;

  @Column('tinyint', {
    width: 1,
    unsigned: true,
    default: 1,
    comment: 'Runing Status',
  })
  status?: number;

  @Column('timestamp', {
    comment: 'Create Timestamp',
  })
  create_time: Date;

  @Column('timestamp', {
    comment: 'Update Timestamp',
  })
  update_time: Date;
}
