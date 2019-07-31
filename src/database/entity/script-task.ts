import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ScriptTask {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar', {
    length: 20,
    comment: '任务名称',
  })
  job_name: string;

  @Column('tinyint', {
    default: 1,
    unsigned: true,
    comment: '状态',
  })
  status: number;

  @Column('int', {
    default: 0,
    unsigned: true,
    comment: '创建时间',
  })
  create_time?: number;

  @Column('int', {
    default: 0,
    unsigned: true,
    comment: '更新时间',
  })
  update_time?: number;
}
