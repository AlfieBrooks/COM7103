import type { FastifyReply, FastifyRequest } from 'fastify';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';
import fastifySupabase from '@psteinroe/fastify-supabase';
import { recipeImageRoutes } from './api/recipe-image.route';
import { errorSchema, messageSchema, paginationSchema, paramIdSchema } from './utils/common.schema';
import { startConsumer } from './consumer';
import { config } from './utils/config';

const main = async () => {
  await startConsumer();

  const server = fastify({ logger: true });

  await server.register(fastifyCors, { origin: '*' });
  await server.register(fastifyJWT, {
    secret: config.supabase.jwtSecret,
  });
  await server.register(fastifySupabase, {
    url: config.supabase.url,
    anonKey: config.supabase.serviceKey,
    serviceKey: config.supabase.serviceKey,
    options: {},
  });

  server.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Json Schemas
  server.addSchema(paginationSchema);
  server.addSchema(paramIdSchema);
  server.addSchema(messageSchema);
  server.addSchema(errorSchema);

  // API Endpoint routes
  await server.register(
    async (api) => {
      api.register(recipeImageRoutes, { prefix: '/recipe-image' });
    },
    { prefix: '/api/v1' },
  );


  return server;
};

export { main };
