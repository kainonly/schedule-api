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

  @Column('tinyint', {
    default: 22,
    unsigned: true,
    comment: 'SSH端口',
  })
  ssh_port: number;

  @Column('text', {
    comment: 'SSH密钥',
  })
  ssh_key: string;

  @Column('tinyint', {
    default: 0,
    width: 1,
    unsigned: true,
    comment: '是否应用容器',
  })
  use_docker?: number;

  @Column('tinyint', {
    default: 0,
    width: 1,
    unsigned: true,
    comment: '是否应用网络回调钩子',
  })
  use_webhook?: number;
}
