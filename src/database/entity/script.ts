import { Column, Entity } from 'typeorm';
import { Base } from '../base';

@Entity()
export class Script extends Base {
  @Column('varchar', {
    length: 20,
    comment: '脚本名称',
  })
  name: string;

  @Column('varchar', {
    comment: '脚本类型',
  })
  type: string;

  @Column('longtext', {
    comment: '脚本内容',
  })
  content: string;
}
