import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as Compress from 'fastify-compress';
import * as Helmet from 'fastify-helmet';

NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
).then(async (app) => {
  app.register(Compress);
  app.register(Helmet);
  await app.listen(3000, '0.0.0.0');
});
