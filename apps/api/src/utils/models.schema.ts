/*
* Some global schemas, representing our stuff from the Database.
* These will be used mostly when serializing data in our responses.
*
* See More: https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
*/

export const recipeSchema = {
  $id: 'recipeSchema',
  type: 'object',
  // required: ['name'],
  nullable: true,
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: ['string', 'null'], format: 'date-time' },
    ingredients: { type: 'array', items: { type: 'string' } },
    instructions: { type: 'array', items: { type: 'string' } },
  },
};