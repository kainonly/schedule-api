import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('tinyint', {
    default: 1,
    width: 1,
    unsigned: true,
    comment: '状态',
  })
  status: number;

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
