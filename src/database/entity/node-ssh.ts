import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from '../base';
import { Node } from './node';

@Entity()
export class NodeSsh extends Base {
  @OneToOne(type => Node, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({
    name: 'node',
    referencedColumnName: 'id',
  })
  node: number;

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
}
