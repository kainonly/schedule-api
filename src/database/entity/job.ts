import { Column, Entity } from 'typeorm';
import { Base } from '../base';

@Entity()
export class Job extends Base {
  @Column('varchar', {
    length: 20,
    comment: '项目名称',
  })
  name: string;

  @Column('text', {
    nullable: true,
    comment: '项目描述',
  })
  note?: string;
}
