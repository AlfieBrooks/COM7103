/*
 * Some global schemas, representing our stuff from the Database.
 * These will be used mostly when serializing data in our responses.
 *
 * See More: https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
 */

export const recipeSchema = {
  $id: 'recipeSchema',
  type: 'object',
  required: ['id', 'title', 'ingredients', 'instructions'],
  nullable: true,
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    title: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: ['string', 'null'], format: 'date-time' },
    ingredients: { type: 'array', items: { type: 'string' } },
    instructions: { type: 'string' },
  },
};

export const userRecipeSchema = {
  $id: 'userRecipeSchema',
  type: 'object',
  required: ['id', 'title', 'ingredients', 'instructions'],
  nullable: true,
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    title: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: ['string', 'null'], format: 'date-time' },
    ingredients: { type: 'array', items: { type: 'string' } },
    instructions: { type: 'string' },
    isPending: { type: 'boolean' },
  },
};
