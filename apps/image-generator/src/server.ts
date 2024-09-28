import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyEtag from '@fastify/etag';
import fastifyJWT from '@fastify/jwt';
import fastifySupabase from '@psteinroe/fastify-supabase';
import { logger } from '@repo/logger';
import { register } from 'prom-client';
import { recipeImageRoutes } from './api/recipe-image.route';
import { errorSchema, messageSchema, paginationSchema, paramIdSchema } from './utils/common.schema';
import { startConsumer } from './consumer';
import { config } from './utils/config';

const main = async () => {
  await startConsumer();

  const server = fastify({ logger });

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
  await server.register(fastifyEtag);

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

  server.get('/health', async (_request, reply) => {
    reply.send({ status: 'ok' });
  });

  server.get('/metrics', async (_request, reply) => {
    try {
      reply.header('Content-Type', register.contentType).send(await register.metrics());
    } catch (err) {
      reply.status(500).send(err);
    }
  });

  return server;
};

export { main };
