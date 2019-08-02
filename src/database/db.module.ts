import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './entity/node';
import { Job } from './entity/job';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([
      Node,
      Job,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {
}
