import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApiTask {
  @PrimaryGeneratedColumn()
  id?: number;

}
