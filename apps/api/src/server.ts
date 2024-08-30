import fastify from "fastify";
import fastifyCors from '@fastify/cors';
import fastifySupabase from 'fastify-supabase';

const main = async () => {
  const server = fastify({ logger: true });

  // Now we setup our server, plugins and such
  await server.register(fastifyCors, { origin: '*' });
  await server.register(fastifySupabase, {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  });

  // Json Schemas
  // server.addSchema(paginationSchema);
  // server.addSchema(paramIdSchema);
  // server.addSchema(messageSchema);

  // server.addSchema(categorySchema);
  // server.addSchema(productSchema);

  // API Endpoint routes
  await server.register(async api => {
    api.register(categoriesRoutes, { prefix: "/recipes" });
    api.register(productsRoutes, { prefix: "/products" });
  }, { prefix: "/api/v1" });

  return server;
};

export { main };