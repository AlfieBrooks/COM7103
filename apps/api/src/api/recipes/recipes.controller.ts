import type { FastifyRequest, FastifyReply } from 'fastify';

export async function getRecipes(request: FastifyRequest<CrudAllRequest>, reply: FastifyReply) {
  const { take, from } = request.query;

  const { data, error } = await request.server.supabaseClient.from('initial_recipes').select()

  // const results = await request.server.prisma.category.findMany({
  //   cursor: from ? { id: from } : undefined,
  //   skip: from ? 1 : undefined,
  //   take,
  //   orderBy: { id: 'desc' }
  // });

  // if (results.length === 0) {
  //   return reply.status(404).send({ message: "No elements found" });
  // }

  return reply.status(200).send({ data, error });
}

export async function getRecipe(request: FastifyRequest<CrudIdRequest>, reply: FastifyReply) {
  const { id } = request.params;

  const { data, error } = await request.server.supabaseClient.from('initial_recipes').select().eq('id', id)

  // if (!category) {
  //   return reply.status(404).send({ message: 'Category not found' });
  // }

  return reply.status(200).send({ data, error });
}

export async function deleteRecipe(request: FastifyRequest<CrudIdRequest>, reply: FastifyReply) {
  const { id } = request.params;

  const { data, error } = await request.server.supabaseClient.from('initial_recipes').delete().eq('id', id).select()

  // await request.server.prisma.category.delete({
  //   where: { id },
  // });

  return reply.status(200).send({ data, error });
}

export async function createRecipe(request: FastifyRequest<PostCategory>, reply: FastifyReply) {
  const { data, error } = await request.server.supabaseClient.from('initial_recipes').insert(request.body)

  // const category = await request.server.prisma.category.create({
  //   data: {
  //     name,
  //   }
  // });

  return reply.status(201).send({ data, error });

}

export async function updateRecipe(request: FastifyRequest<PutCategory>, reply: FastifyReply) {
  // const { title } = request.body;
  const { id } = request.params;

  const { data, error } = await request.server.supabaseClient.from('initial_recipes').update(request.body).eq('id', id).select()


  // const category = await request.server.prisma.category.update({
  //   where: { id },
  //   data: { name },
  // });

  return reply.status(200).send({ data, error });

}
