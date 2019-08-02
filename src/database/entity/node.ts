import { Column, Entity } from 'typeorm';
import { Base } from '../base';

@Entity()
export class Node extends Base {
  @Column('varchar', {
    length: 20,
    comment: '实例',
  })
  name: string;

  @Column('varchar', {
    length: 20,
    nullable: true,
    comment: '标记',
  })
  mark?: string;

  @Column('varchar', {
    length: 40,
    comment: '外网',
  })
  extranet: string;
}
