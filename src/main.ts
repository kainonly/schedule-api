import * as fastify from 'fastify';
import * as fastifyCompress from 'fastify-compress';
import * as fastifyElasticsearch from 'fastify-elasticsearch';
import { Client } from '@elastic/elasticsearch';
import { env } from 'process';

import { AppModule } from './app.module';

declare module 'fastify' {
  interface FastifyInstance<HttpServer, HttpRequest, HttpResponse> {
    elastic: Client;
  }
}

const server: fastify.FastifyInstance = fastify({
  logger: true,
});
server.register(fastifyCompress);
server.register(fastifyElasticsearch, {
  client: new Client({
    node: env.node,
  }),
});
server.register(AppModule.footRoot);
server.listen(3000, '0.0.0.0', (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening on ${address}`);
});
