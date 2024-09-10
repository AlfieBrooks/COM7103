import fastify from "fastify";
import fastifyCors from '@fastify/cors';
import fastifyJWT from "@fastify/jwt";
import fastifySupabase from "@psteinroe/fastify-supabase";
import { recipesRoutes } from "./api/recipes/recipes.route";
import { recipeSchema } from "./utils/models.schema";
import { messageSchema, paginationSchema, paramIdSchema } from "./utils/common.schema";

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
    // serviceKey: process.env.SUPABASE_SERVICE_KEY,
    // you can pass any `SupabaseClientOptions`
    options: {},
    // supabaseUrl: process.env.SUPABASE_URL,
    // supabaseKey: process.env.SUPABASE_KEY,
  });


  // Json Schemas
  server.addSchema(paginationSchema);
  server.addSchema(paramIdSchema);
  server.addSchema(messageSchema);

  server.addSchema(recipeSchema);
  // server.addSchema(productSchema);

  // API Endpoint routes
  await server.register(async api => {
    api.register(recipesRoutes, { prefix: "/recipes" });
    // api.register(productsRoutes, { prefix: "/products" });
  }, { prefix: "/api/v1" });

  return server;
};

export { main };