import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyEtag from '@fastify/etag';
import fastifyJWT from '@fastify/jwt';
import fastifySupabase from '@psteinroe/fastify-supabase';
import { recipeImageRoutes } from './api/recipe-image.route';
import { errorSchema, messageSchema, paginationSchema, paramIdSchema } from './utils/common.schema';
import { startConsumer } from './consumer';
import { config } from './utils/config';
import { logger } from './utils/logger';

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


  return server;
};

export { main };
