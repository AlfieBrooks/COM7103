import type { FastifyInstance } from 'fastify';
import { createRecipe, deleteRecipe, getRecipes, getRecipe, getUserRecipes, updateRecipe } from './recipes.controller';
import { createSchema, deleteSchema, getAllSchema, getSchema, updateSchema } from './recipes.schema';

export const recipesRoutes = async (fastify: FastifyInstance) => {
  // List all Recipes, paginated
  fastify.get('/', { schema: getAllSchema }, getRecipes);

  // Get one Recipe
  fastify.get('/:id', { schema: getSchema }, getRecipe);

  // List all of a given users Recipes
  fastify.get('/user', { schema: getAllSchema, onRequest: [fastify.authenticate] }, getUserRecipes);

  // Deleting a Recipe
  fastify.delete('/:id', { schema: deleteSchema, onRequest: [fastify.authenticate] }, deleteRecipe);

  // Create a new Recipe
  fastify.post('/', { schema: createSchema, onRequest: [fastify.authenticate] }, createRecipe);

  // Update an existing Recipe
  fastify.put('/:id', { schema: updateSchema, onRequest: [fastify.authenticate] }, updateRecipe);
};
