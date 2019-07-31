import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { DbService } from '../common/db.service';
import { CurdFactory } from '../common/curd.factory';
import { Validate, ValidateTypeOfDelete, ValidateTypeOfEdit, ValidateTypeOfGet, ValidateTypeOfLists } from '../helper';

@Controller('api-task')
export class ApiTaskController {
  private curd: CurdFactory;

  constructor(
    private db: DbService,
  ) {
    this.curd = DbService.Curd(db.apiTask);
  }

  @Post('get')
  @UsePipes(ValidateTypeOfGet())
  get(@Body() body: any): Promise<any> {
    return this.curd.get(body);
  }

  @Post('lists')
  @UsePipes(ValidateTypeOfLists())
  async lists(@Body() body: any): Promise<any> {
    return this.curd.lists(body);
  }

  @Post('add')
  @UsePipes(Validate({
    required: ['job_name', 'status'],
  }))
  async add(@Body() body: any): Promise<any> {
    return this.curd.add({
      job_name: body.job_name,
      status: true,
    });
  }

  @Post('edit')
  @UsePipes(ValidateTypeOfEdit({
    required: ['job_name', 'status'],
  }))
  async edit(@Body() body: any): Promise<any> {
    return this.curd.edit(body);
  }

  @Post('delete')
  @UsePipes(ValidateTypeOfDelete())
  async delete(@Body() body: any): Promise<any> {
    return this.curd.delete(body);
  }
}
