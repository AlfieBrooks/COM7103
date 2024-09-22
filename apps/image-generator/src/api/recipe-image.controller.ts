import fs from 'node:fs';
import type { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';
import { config } from '../utils/config';
import { CustomError } from '../utils/custom-error';

export async function getRecipeImage(request: FastifyRequest<CrudIdRequest>, reply: FastifyReply): Promise<void> {
  const { id } = request.params;

  try {
    await checkRecipeImageExists(request, id);
    const signedUrl = await getSignedImageUrl(request, id);
    const image = await getImageFromUrl(request, signedUrl);

    return reply.header('Content-Type', 'image/png').status(200).send(image);
  } catch (error) {
    // const placeholderImage = fs.readFileSync('./src/assets/placeholder.png');
    // const image = Buffer.from(placeholderImage);
    // return reply.header('Content-Type', 'image/png').status(404).send(image);
    return reply.status(404).send({ message: 'Image not found' });
  }
}

async function checkRecipeImageExists(request: FastifyRequest<CrudIdRequest>, id: string): Promise<void> {
  try {
    const { data: recipeData } = await request.server.supabaseClient
      .from(config.supabase.bucketName)
      .select()
      .eq('id', id);

    if (!recipeData?.length) {
      throw new CustomError('Recipe image not found', 404);
    }

  } catch (error) {
    request.log.error(error, 'Error checking recipe image exists');
    throw error;
  }
}

async function getSignedImageUrl(request: FastifyRequest<CrudIdRequest>, id: string): Promise<string> {
  try {
    const { data: recipeImageData, error: recipeImageError } = await request.server.supabaseClient.storage
      .from(config.supabase.bucketName)
      .createSignedUrl(`${id}.png`, 60);

    const signedUrl = recipeImageData?.signedUrl;
    if (recipeImageError || !signedUrl) {
      throw new CustomError('Failed to get signed image URL', 500);
    }

    return signedUrl;
  } catch (error) {
    request.log.error(error, 'Error fetching signed image URL');
    throw error;
  }
}

async function getImageFromUrl(request: FastifyRequest<CrudIdRequest>, url: string): Promise<Buffer> {
  try {
    const imageData = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(imageData.data, 'base64');
  } catch (error) {
    request.log.error(error, 'Error fetching image from URL');
    throw new CustomError('Failed to fetch image from URL', 500);
  }
}
