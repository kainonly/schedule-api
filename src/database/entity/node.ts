import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Node {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar', {
    length: 20,
    comment: '主机命名',
  })
  name: string;

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

  @Column('int', {
    default: 0,
    unsigned: true,
    comment: '创建时间',
  })
  create_time: number;

  @Column('int', {
    default: 0,
    unsigned: true,
    comment: '更新时间',
  })
  update_time: number;
}
