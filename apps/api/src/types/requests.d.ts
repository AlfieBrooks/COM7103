/*
 * Some types used mostly to extract data from:
 * - Request parameters
 * - POST body
 * - Query string
 */

interface CrudAllRequest {
  Querystring: {
    to: number;
    from?: number;
  };
}

interface CrudIdRequest {
  Params: {
    id: string;
  };
}

interface PostRecipe {
  Body: {
    userId: string;
    title: string;
    ingredients: string[];
    instructions: string;
  };
}

interface PutRecipe {
  Body: {
    userId: string;
    title: string;
    ingredients: string[];
    instructions: string;
  };
  Params: {
    id: string;
  };
}
