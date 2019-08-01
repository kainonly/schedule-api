import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar', {
    length: 20,
    comment: '项目分组',
  })
  name: string;
}
