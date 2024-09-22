import axios from 'axios';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { getRabbitMQInstance } from '../utils/rabbitmq-setup';
import { config } from '../utils/config';

export async function getRecipes(request: FastifyRequest<CrudAllRequest>, reply: FastifyReply) {
  const { from, to } = request.query;

  const { data, count, error } = await request.server.supabaseClient
    .from(config.supabase.tableName)
    .select('*', { count: 'exact' })
    .order('id', { ascending: true })
    .range(from ?? 0, to);

  if (data?.length === 0) {
    return reply.status(404).send({ message: 'No items found' });
  }

  return reply.status(200).send({ data, count, error });
}

export async function getRecipe(request: FastifyRequest<CrudIdRequest>, reply: FastifyReply) {
  const { id } = request.params;

  const { data, error } = await request.server.supabaseClient.from(config.supabase.tableName).select().eq('id', id);

  const recipe = data?.[0];
  if (!recipe) {
    return reply.status(404).send({ message: 'Recipe not found' });
  }

  return reply.status(200).send({ data: recipe, error });
}

export async function getUserRecipes(request: FastifyRequest<CrudAllRequest>, reply: FastifyReply) {
  const { from, to } = request.query;

  const { data, count, error } = await request.server.supabaseClient
    .from(config.supabase.tableName)
    .select('*', { count: 'exact' })
    .eq('userId', request.supabaseUser.sub)
    .order('id', { ascending: true })
    .range(from ?? 0, to);

  if (!data || data?.length === 0) {
    return reply.status(404).send({ message: 'No items found' });
  }

  const results = await Promise.all(
    data.map(async (recipe) => {
      try {
        await axios.get(`${config.imageApi.url}/recipe-image/${recipe.id}`);
        return { ...recipe, isPending: false };
      } catch (error) {
        request.log.error(error);
        return { ...recipe, isPending: true };
      }
    }),
  );
  return reply.status(200).send({ data: results, count, error });
}

export async function deleteRecipe(request: FastifyRequest<CrudIdRequest>, reply: FastifyReply) {
  const { id } = request.params;

  const { data, error } = await request.server.supabaseClient.from(config.supabase.tableName).delete().eq('id', id).select();

  const recipe = data?.[0];
  if (!recipe) {
    return reply.status(404).send({ message: 'Recipe not found' });
  }
  return reply.status(200).send({ data: recipe, error });
}

export async function createRecipe(request: FastifyRequest<PostRecipe>, reply: FastifyReply) {
  const { data, error } = await request.server.supabaseClient
    .from(config.supabase.tableName)
    .insert({
      ...request.body,
      userId: request.supabaseUser.sub,
    })
    .select();

  const message = {
    id: data?.[0].id,
    title: request.body.title,
    ingredients: request.body.ingredients
  };

  const channel = await getRabbitMQInstance();
  channel.sendToQueue('recipe_image_queue', Buffer.from(JSON.stringify(message)));

  return reply.status(201).send({ data, error });
}

export async function updateRecipe(request: FastifyRequest<PutRecipe>, reply: FastifyReply) {
  const { id } = request.params;

  const { data, error } = await request.server.supabaseClient
    .from(config.supabase.tableName)
    .update(request.body)
    .eq('id', id)
    .select();

  const recipe = data?.[0];
  if (!recipe) {
    return reply.status(404).send({ message: 'Recipe not found' });
  }
  return reply.status(200).send({ data: recipe, error });
}
