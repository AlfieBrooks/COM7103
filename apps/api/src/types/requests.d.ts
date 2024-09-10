/*
* Some types used mostly to extract data from:
* - Request parameters
* - POST body
* - Query string
*/

interface CrudAllRequest {
  Querystring: {
    take: number;
    from?: string;
  }
}

interface CrudIdRequest {
  Params: {
    id: string;
  }
}

interface PostCategory {
  Body: {
    title: string;
  }
}

interface PutCategory {
  Body: {
    title: string;
  }
  Params: {
    id: string;
  }
}

interface PostProduct {
  Body: {
    title: string;
    published: boolean;
    price: number;
    categoryId: string;
  }
}

interface PutProduct {
  Body: {
    title: string;
    published: boolean;
    price: number;
    categoryId: string;
  }
  Params: {
    id: string;
  }
}