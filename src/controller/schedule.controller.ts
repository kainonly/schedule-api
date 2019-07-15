import { Controller, Post, Req, Request, UsePipes } from '@nestjs/common';
import { ScheduleRepository } from '../repository/schedule.repository';
import { SchemaPipe } from '../common/schema.pipe';
import { MainSchema } from '../validation/main.schema';

@Controller('schedule')
export class ScheduleController {

  constructor(
    private scheduleRepository: ScheduleRepository,
  ) {
  }

  @Post('get')
  @UsePipes(new SchemaPipe(MainSchema.get))
  async get(@Req() request: Request): Promise<any> {
    const param = request.body;
    const data = await this.scheduleRepository.repository.find();
    return {
      error: 0,
      data,
    };
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
