import * as fastify from 'fastify';
import * as fastifyCompress from 'fastify-compress';
import fastifyPouchDB from 'fastify-pouchdb';
import { env } from 'process';

import { route } from './route';

const server: fastify.FastifyInstance = fastify({
  logger: true,
});
server.register(fastifyCompress);
server.register(fastifyPouchDB, {
  name: env.STORAGE,
});
server.register(route);
server.listen(3000, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening on ${address}`);
});
