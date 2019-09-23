import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as fastifyCompress from 'fastify-compress';
import { AppModule } from './app.module';

NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
).then(async (app) => {
  app.register(fastifyCompress);
  app.enableShutdownHooks();
  await app.listen(3000);
});
