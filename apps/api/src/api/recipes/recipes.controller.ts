import type { FastifyRequest, FastifyReply } from 'fastify';

export async function getRecipes(request: FastifyRequest<CrudAllRequest>, reply: FastifyReply) {
  const { from, to } = request.query;

  const { data, count, error } = await request.server.supabaseClient
    .from('initial_recipes')
    .select('*', { count: 'exact' })
    .order('id', { ascending: true })
    .range(from ?? 0, to);

  // const results = await request.server.prisma.category.findMany({
  //   cursor: from ? { id: from } : undefined,
  //   skip: from ? 1 : undefined,
  //   take,
  //   orderBy: { id: 'desc' }
  // });

  if (data?.length === 0) {
    return reply.status(404).send({ message: 'No items found' });
  }

  return reply.status(200).send({ data, count, error });
}

export async function getRecipe(request: FastifyRequest<CrudIdRequest>, reply: FastifyReply) {
  const { id } = request.params;

  const { data, error } = await request.server.supabaseClient.from('initial_recipes').select().eq('id', id);

  const recipe = data?.[0];
  if (!recipe) {
    return reply.status(404).send({ message: 'Recipe not found' });
  }

  return reply.status(200).send({ data: recipe, error });
}

export async function getUserRecipes(request: FastifyRequest<CrudAllRequest>, reply: FastifyReply) {
  const { from, to } = request.query;

  const { data, count, error } = await request.server.supabaseClient
    .from('initial_recipes')
    .select('*', { count: 'exact' })
    .eq('userId', request.supabaseUser.sub)
    .order('id', { ascending: true })
    .range(from ?? 0, to);

  // const results = await request.server.prisma.category.findMany({
  //   cursor: from ? { id: from } : undefined,
  //   skip: from ? 1 : undefined,
  //   take,
  //   orderBy: { id: 'desc' }
  // });

  if (data?.length === 0) {
    return reply.status(404).send({ message: 'No items found' });
  }

  return reply.status(200).send({ data, count, error });
}

export async function deleteRecipe(request: FastifyRequest<CrudIdRequest>, reply: FastifyReply) {
  const { id } = request.params;

  const { data, error } = await request.server.supabaseClient.from('initial_recipes').delete().eq('id', id).select();

  const recipe = data?.[0];
  if (!recipe) {
    return reply.status(404).send({ message: 'Recipe not found' });
  }
  return reply.status(200).send({ data: recipe, error });
}

export async function createRecipe(request: FastifyRequest<PostRecipe>, reply: FastifyReply) {
  const { data, error } = await request.server.supabaseClient
    .from('initial_recipes')
    .insert({
      ...request.body,
      userId: request.supabaseUser.sub,
    })
    .select();

  return reply.status(201).send({ data, error });
}

export async function updateRecipe(request: FastifyRequest<PutRecipe>, reply: FastifyReply) {
  const { id } = request.params;

  const { data, error } = await request.server.supabaseClient
    .from('initial_recipes')
    .update(request.body)
    .eq('id', id)
    .select();

  const recipe = data?.[0];
  if (!recipe) {
    return reply.status(404).send({ message: 'Recipe not found' });
  }
  return reply.status(200).send({ data: recipe, error });
}
