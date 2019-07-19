import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { DbService } from '../common/db.service';
import { CurdFactory } from '../common/curd.factory';
import { DeleteValidate, EditValidate, GetValidate, ListsValidate, V, Validate } from '../helper';

@Controller('queue-task')
export class QueueTaskController {
  private curd: CurdFactory;

  constructor(
    private db: DbService,
  ) {
    this.curd = DbService.Curd(db.queueTask);
  }

  @Post('get')
  @UsePipes(GetValidate())
  get(@Body() body: any): Promise<any> {
    return this.curd.get(body);
  }

  @Post('lists')
  @UsePipes(ListsValidate())
  async lists(@Body() body: any): Promise<any> {
    return this.curd.lists(body);
  }

  @Post('add')
  @UsePipes(Validate({
    job_name: V.string().required(),
    cron: V.string().required(),
    status: V.boolean(),
  }))
  async add(@Body() body: any): Promise<any> {
    return this.curd.add({
      job_name: body.job_name,
      cron: body.cron,
      status: true,
    });
  }

  @Post('edit')
  @UsePipes(EditValidate({
    job_name: V.string(),
    cron: V.string(),
    status: V.boolean(),
  }))
  async edit(@Body() body: any): Promise<any> {
    return this.curd.edit(body);
  }

  @Post('delete')
  @UsePipes(DeleteValidate())
  async delete(@Body() body: any): Promise<any> {
    return this.curd.delete(body);
  }
}
