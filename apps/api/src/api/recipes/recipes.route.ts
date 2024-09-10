import type { FastifyInstance } from "fastify";
import { verifyApiKey } from "../../utils/verify";
import { createRecipe, deleteRecipe, getRecipes, getRecipe, updateRecipe } from "./recipes.controller";
import { createSchema, deleteSchema, getAllSchema, getSchema, updateSchema } from "./recipes.schema";

export const recipesRoutes = (fastify: FastifyInstance) => {
  // List all categories, paginated
  fastify.get('/', { schema: getAllSchema, onRequest: [verifyApiKey] }, getRecipes);

  // Get one Recipe
  fastify.get('/:id', { schema: getSchema, onRequest: [verifyApiKey] }, getRecipe);

  // Deleteing a Category
  fastify.delete('/:id', { schema: deleteSchema, onRequest: [verifyApiKey] }, deleteRecipe);

  // Create a new Recipe
  fastify.post('/', { schema: createSchema, onRequest: [verifyApiKey] }, createRecipe);

  // Update an existing Recipe
  fastify.put('/:id', { schema: updateSchema, onRequest: [verifyApiKey] }, updateRecipe);
}