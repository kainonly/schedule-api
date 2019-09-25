import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

const server: fastify.FastifyInstance<Server,
  IncomingMessage,
  ServerResponse> = fastify({
  logger: true,
});

server.get('/', (request, reply) => {
  reply.send({ hello: 'world' });
});

server.listen(3000, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening on ${address}`);
});
