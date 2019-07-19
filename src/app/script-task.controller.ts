import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CurdService } from '../common/curd.service';
import { V, Validate } from '../helper';

@Controller('script-task')
export class ScriptTaskController {
  constructor(
    private curd: CurdService,
  ) {
  }

  @Post('get')
  @UsePipes(CurdService.GetValidate())
  get(@Body() body: any): Promise<any> {
    return CurdService.Get(this.curd.scriptTask, body);
  }

  @Post('lists')
  @UsePipes(CurdService.ListsValidate())
  async lists(@Body() body: any): Promise<any> {
    return CurdService.Lists(this.curd.scriptTask, body);
  }

  @Post('add')
  @UsePipes(Validate({
    job_name: V.string().required(),
    cron: V.string().required(),
    status: V.boolean(),
  }))
  async add(@Body() body: any): Promise<any> {
    return CurdService.Add(this.curd.scriptTask, {
      job_name: body.job_name,
      cron: body.cron,
      status: true,
    });
  }

  @Post('edit')
  @UsePipes(CurdService.EditValidate({
    job_name: V.string(),
    cron: V.string(),
    status: V.boolean(),
  }))
  async edit(@Body() body: any): Promise<any> {
    return CurdService.Edit(this.curd.scriptTask, body);
  }

  @Post('delete')
  @UsePipes(CurdService.DeleteValidate())
  async delete(@Body() body: any): Promise<any> {
    return CurdService.Delete(this.curd.scriptTask, body);
  }
}
