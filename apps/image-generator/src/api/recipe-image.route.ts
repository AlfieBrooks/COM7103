import type { FastifyInstance } from 'fastify';
import { getRecipeImage } from './recipe-image.controller';
import { getSchema } from './recipe-image.schema';

export const recipeImageRoutes = async (fastify: FastifyInstance) => {
  // Get a recipe image by ID
  fastify.get('/:id', { schema: getSchema }, getRecipeImage);
};
