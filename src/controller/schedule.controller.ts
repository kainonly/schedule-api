import { Controller, Get, Post } from '@nestjs/common';
import { ScheduleRepository } from '../repository/schedule.repository';

@Controller('schedule')
export class ScheduleController {

  constructor(
    private scheduleRepository: ScheduleRepository,
  ) {
  }

  @Post('get')
  async get(): Promise<any> {
    return {};
  }

  @Post('lists')
  async lists(): Promise<any> {
    const data = await this.scheduleRepository.repository.find();
    return {
      error: 0,
      data,
    };
  }

  @Post('add')
  async add(): Promise<any> {
    return {};
  }

  @Post('update')
  async update(): Promise<any> {
    return {};
  }

  @Post('delete')
  async delete(): Promise<any> {
    return {};
  }
}
