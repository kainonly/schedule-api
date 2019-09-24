import { BadRequestException, Body, Controller, OnModuleInit, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from './common/validation.pipe';
import { JobsService } from './service/jobs.service';
import { StorageService } from './service/storage.service';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly jobsService: JobsService,
    private readonly storageService: StorageService,
  ) {
  }

  onModuleInit(): any {
    this.jobsService.runtime.subscribe(data => {
      this.storageService.logging({
        type: 'run',
        identity: data.identity,
        output: data.output,
        status: true,
        create_time: (new Date()).getTime(),
      });
    });
    this.storageService.get('jobs').then((response: any) => {
      if (response === null) {
        return;
      }
      const { data } = response;
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this.jobsService.put(data[key]);
        }
      }
    }).catch(error => {
      console.log(error);
    });
  }

  @Post('lists')
  @UsePipes(new ValidationPipe({
    required: ['identity'],
    properties: {
      identity: {
        type: 'array',
      },
    },
  }))
  lists(@Body() body: any) {
    const lists = body.identity.map((v: any) => this.jobsService.get(v));
    return {
      error: 0,
      data: lists,
    };
  }

  @Post('get')
  @UsePipes(new ValidationPipe({
    required: ['identity'],
    properties: {
      identity: {
        type: 'string',
      },
    },
  }))
  get(@Body() body: any) {
    const result = this.jobsService.get(body.identity);
    return result ? {
      error: 0,
      data: result,
    } : {
      error: 1,
      msg: 'not exists',
    };
  }

  @Post('put')
  @UsePipes(new ValidationPipe({
    required: ['identity', 'time', 'bash', 'start', 'zone'],
    properties: {
      identity: {
        type: 'string',
      },
      time: {
        type: 'string',
      },
      bash: {
        type: 'string',
      },
      start: {
        type: 'boolean',
      },
      zone: {
        type: 'string',
      },
    },
  }))
  async put(@Body() body: any) {
    try {
      const result: boolean = this.jobsService.put(body);
      const response = await this.storageService.logging({
        type: 'put',
        identity: body.identity,
        response: body,
        status: result,
        create_time: (new Date()).getTime(),
      });
      const runtime = await this.temporaryJobs();
      return result && response.ok && runtime.ok ? {
        error: 0,
        msg: 'ok',
      } : {
        error: 1,
        msg: 'failed',
      };
    } catch (e) {
      throw new BadRequestException({
        error: 1,
        msg: e.message,
      });
    }
  }

  @Post('delete')
  @UsePipes(new ValidationPipe({
    required: ['identity'],
    properties: {
      identity: {
        type: 'string',
      },
    },
  }))
  async delete(@Body() body: any) {
    try {
      const result: boolean = this.jobsService.delete(body.identity);
      const response = await this.storageService.logging({
        type: 'delete',
        identity: body.identity,
        response: body,
        status: result,
        create_time: (new Date()).getTime(),
      });
      const runtime = await this.temporaryJobs();
      return result && response.ok && runtime.ok ? {
        error: 0,
        msg: 'ok',
      } : {
        error: 1,
        msg: 'failed',
      };
    } catch (e) {
      throw new BadRequestException({
        error: 1,
        msg: e.message,
      });
    }
  }

  @Post('status')
  @UsePipes(new ValidationPipe({
    required: ['identity', 'status'],
    properties: {
      identity: {
        type: 'string',
      },
      status: {
        type: 'boolean',
      },
    },
  }))
  async status(@Body() body: any) {
    try {
      if (body.status) {
        this.jobsService.start(body.identity);
      } else {
        this.jobsService.stop(body.identity);
      }
      const response = await this.storageService.logging({
        type: 'status',
        identity: body.identity,
        response: body,
        status: true,
        create_time: (new Date()).getTime(),
      });
      if (response.ok) {
        return {
          error: 0,
          msg: 'ok',
        };
      } else {
        return {
          error: 1,
          msg: 'failed',
        };
      }
    } catch (e) {
      throw new BadRequestException({
        error: 1,
        msg: e.message,
      });
    }
  }

  @UsePipes(new ValidationPipe({
    required: ['type', 'identity', 'limit', 'skip'],
    properties: {
      type: {
        type: 'string',
        enum: ['put', 'delete', 'status', 'run'],
      },
      identity: {
        type: 'string',
      },
      limit: {
        type: 'number',
        minimum: 1,
        maximum: 50,
      },
      skip: {
        type: 'number',
        minimum: 1,
      },
    },
  }))
  @Post('logging')
  async logging(@Body() body: any) {
    try {
      return await this.storageService.find(
        body.type,
        body.identity,
        body.limit,
        body.skip,
      );
    } catch (e) {
      throw new BadRequestException({
        error: 1,
        msg: e.message,
      });
    }
  }

  /**
   * Temporary Jobs
   */
  private async temporaryJobs() {
    return await this.storageService.add('jobs', {
      data: this.jobsService.getJobs(),
    });
  }
}
