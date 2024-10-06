import type { FastifyReply, FastifyRequest } from 'fastify';
import fastify from 'fastify';
import fastifyCaching from '@fastify/caching';
import fastifyCors from '@fastify/cors';
import fastifyEtag from '@fastify/etag';
import fastifyJWT from '@fastify/jwt';
// import fastifyRateLimit from '@fastify/rate-limit';
import fastifyMetrics from 'fastify-metrics';
import fastifySupabase from '@psteinroe/fastify-supabase';
import { logger } from '@repo/logger';
import { config } from './utils/config';
import { recipesRoutes } from './api/recipes.route';
import { recipeSchema, userRecipeSchema } from './utils/models.schema';
import { errorSchema, messageSchema, paginationSchema, paramIdSchema } from './utils/common.schema';

const main = async () => {
  const server = fastify({ logger });

  // Now we setup our server, plugins and such
  await server.register(fastifyCors, { origin: '*' });
  await server.register(fastifyJWT, {
    secret: config.supabase.jwtSecret,
  });
  await server.register(fastifySupabase, {
    url: config.supabase.url,
    anonKey: config.supabase.anonKey,
    serviceKey: config.supabase.serviceKey,
    options: {},
  });
  await server.register(fastifyEtag);
  await server.register(fastifyCaching, {
    privacy: fastifyCaching.privacy.PUBLIC,
    expiresIn: 5
  });
  await server.register(fastifyMetrics, { endpoint: '/metrics' });

  // await server.register(fastifyRateLimit, {
  //   max: 100,
  //   timeWindow: '1 minute'
  // })


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

  server.addSchema(recipeSchema);
  server.addSchema(userRecipeSchema);

  // API Endpoint routes
  await server.register(
    async (api) => {
      api.register(recipesRoutes, { prefix: '/recipes' });
    },
    { prefix: '/api/v1' },
  );

  server.get('/health', async (_request, reply) => {
    reply.send({ status: 'ok' });
  });

  return server;
};

export { main };
