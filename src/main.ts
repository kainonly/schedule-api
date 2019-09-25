import * as fastify from 'fastify';
import * as fastifyCompress from 'fastify-compress';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { route } from './route';

const server: fastify.FastifyInstance<Server,
  IncomingMessage,
  ServerResponse> = fastify({
  logger: true,
});
server.register(fastifyCompress);
server.register(route);

server.listen(3000, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening on ${address}`);
});
