import axios from 'axios';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { getRabbitMQInstance } from '../utils/rabbitmq-setup';
import { config } from '../utils/config';

export async function getRecipes(request: FastifyRequest<CrudAllRequest>, reply: FastifyReply) {
  const { from, to } = request.query;
  request.log.info(`Fetching recipes from ${from ?? 0} to ${to}`);

  const { data, count, error } = await request.server.supabaseClient
    .from(config.supabase.tableName)
    .select('*', { count: 'exact' })
    .order('id', { ascending: true })
    .range(from ?? 0, to);

  if (error) {
    request.log.error('Failed to fetch recipes', error);
    return reply.status(500).send({ message: 'Failed to fetch recipes' });
  }

  if (data?.length === 0) {
    request.log.warn('No items found');
    return reply.status(404).send({ message: 'No items found' });
  }

  request.log.info(`Fetched ${data.length} recipes`);
  return reply.status(200).send({ data, count, error });
}

export async function getRecipe(request: FastifyRequest<CrudIdRequest>, reply: FastifyReply) {
  const { id } = request.params;
  request.log.info(`Fetching recipe with ID: ${id}`);

  const { data, error } = await request.server.supabaseClient
    .from(config.supabase.tableName)
    .select()
    .eq('id', id);

  const recipe = data?.[0];
  if (!recipe) {
    request.log.warn(`Recipe with ID: ${id} not found`);
    return reply.status(404).send({ message: 'Recipe not found' });
  }

  if (error) {
    request.log.error(`Failed to fetch recipe with ID: ${id}`, error);
    return reply.status(500).send({ message: 'Failed to fetch recipe' });
  }

  request.log.info(`Fetched recipe with ID: ${id}`);
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
        request.log.info(`Fetched image for recipe ID: ${recipe.id}`);
        return { ...recipe, isPending: false };
      } catch (error) {
        request.log.error(`Error fetching image for recipe ID: ${recipe.id}`, error);
        return { ...recipe, isPending: true };
      }
    }),
  );

  request.log.info(`Fetched images for all recipes. Results: ${JSON.stringify(results)}`);
  return reply.status(200).send({ data: results, count, error });
}

export async function deleteRecipe(request: FastifyRequest<CrudIdRequest>, reply: FastifyReply) {
  const { id } = request.params;
  request.log.info(`Deleting recipe with ID: ${id}`);

  const { data, error } = await request.server.supabaseClient.from(config.supabase.tableName).delete().eq('id', id).select();

  if (error) {
    request.log.error(`Error deleting recipe with ID: ${id}`, error);
    return reply.status(500).send({ message: 'Failed to delete recipe' });
  }

  const recipe = data?.[0];
  if (!recipe) {
    request.log.warn(`Recipe with ID: ${id} not found`);
    return reply.status(404).send({ message: 'Recipe not found' });
  }

  request.log.info(`Deleted recipe with ID: ${id}`);
  return reply.status(200).send({ data: recipe, error });
}

export async function createRecipe(request: FastifyRequest<PostRecipe>, reply: FastifyReply) {
  request.log.info(`Creating new recipe with data: ${JSON.stringify(request.body)}`);

  const { data, error } = await request.server.supabaseClient
    .from(config.supabase.tableName)
    .insert({
      ...request.body,
      userId: request.supabaseUser.sub,
    })
    .select();

  if (error) {
    request.log.error('Failed to create recipe', error);
    return reply.status(500).send({ message: 'Failed to create recipe' });
  }

  const message = {
    id: data?.[0].id,
    title: request.body.title,
    ingredients: request.body.ingredients
  };

  request.log.info({ message }, 'Sending message to RabbitMQ');
  const channel = await getRabbitMQInstance();
  channel.sendToQueue('recipe_image_queue', Buffer.from(JSON.stringify(message)));

  request.log.info(`Created recipe with ID: ${data?.[0].id}`);
  return reply.status(201).send({ data, error });
}

export async function updateRecipe(request: FastifyRequest<PutRecipe>, reply: FastifyReply) {
  const { id } = request.params;
  request.log.info(`Updating recipe with ID: ${id}`);

  const { data, error } = await request.server.supabaseClient
    .from(config.supabase.tableName)
    .update(request.body)
    .eq('id', id)
    .select();

  if (error) {
    request.log.error(`Failed to update recipe with ID: ${id}`, error);
    return reply.status(500).send({ message: 'Failed to update recipe' });
  }

  const recipe = data?.[0];
  if (!recipe) {
    request.log.warn(`Recipe with ID: ${id} not found`);
    return reply.status(404).send({ message: 'Recipe not found' });
  }

  request.log.info(`Successfully updated recipe with ID: ${id}`);
  return reply.status(200).send({ data: recipe, error });
}
