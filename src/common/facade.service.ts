import { Injectable } from '@nestjs/common';
import { config, DotenvParseOutput } from 'dotenv';

@Injectable()
export class FacadeService {
  env: any | DotenvParseOutput;

  constructor() {
    this.env = config().parsed;
  }
}
