import type { FastifyReply, FastifyRequest } from 'fastify';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';
import fastifySupabase from '@psteinroe/fastify-supabase';
import { recipesRoutes } from './api/recipes/recipes.route';
import { recipeSchema } from './utils/models.schema';
import { errorSchema, messageSchema, paginationSchema, paramIdSchema } from './utils/common.schema';

const main = async () => {
  const server = fastify({ logger: true });

  // Now we setup our server, plugins and such
  await server.register(fastifyCors, { origin: '*' });
  await server.register(fastifyJWT, {
    secret: process.env.JWT_SECRET,
  });
  await server.register(fastifySupabase, {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
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

  server.addSchema(recipeSchema);

  // API Endpoint routes
  await server.register(
    async (api) => {
      api.register(recipesRoutes, { prefix: '/recipes' });
    },
    { prefix: '/api/v1' },
  );

  return server;
};

export { main };
