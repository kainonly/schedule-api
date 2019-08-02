import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from '../base';
import { Node } from './node';

@Entity()
export class NodeDocker extends Base {
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
  port: number;

  @Column('text', {
    comment: 'SSH密钥',
  })
  tls: string;
}
