/*
 * Schemas used for Validation and Validation and Serialization of our routes/endpoints
 *
 * These are used to:
 *  - Validate incoming requests (URL params, body, headers, query string)
 *  - Automatically serialize the response objects
 *  - Also, Swagger uses these schemas to generate the documentation!
 *
 * See More: https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
 */

// GET '/:id'
export const getSchema = {
  params: { $ref: 'paramIdSchema' },
  tags: ['recipes'],
  description: 'Get a recipe image by ID',
  response: {
    200: {
      type: 'string',
      media: {
        binaryEncoding: 'base64',
        type: 'image/png'
      },
    },
    404: { $ref: 'messageResponseSchema#' },
  },
};
