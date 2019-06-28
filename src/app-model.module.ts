import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from './entity/schedule.entity';
import { ScheduleRepository } from './repository/schedule.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([
      ScheduleEntity,
    ]),
  ],
  providers: [
    ScheduleRepository,
  ],
  exports: [
    ScheduleRepository,
  ],
})
export class AppModelModule {
}
