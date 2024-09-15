import type { Channel, ConsumeMessage, Connection } from 'amqplib';
import { connect } from 'amqplib';
import { createClient } from '@supabase/supabase-js';
import { generateImage } from "./utils/generate-image";
import { logger } from './utils/logger';
import { config } from './utils/config';

interface RecipeMessage {
  id: string;
  title: string;
  ingredients: string[];
}

class ImageGenerationConsumer {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    this.supabase = createClient(config.supabase.url, config.supabase.key);
  }

  async start(): Promise<void> {
    try {
      await this.connect();
      await this.setupQueues();
      await this.consume();
    } catch (error) {
      logger.error('Failed to start consumer:', error);
      await this.cleanup();
    }
  }

  private async connect(): Promise<void> {
    this.connection = await connect(config.rabbitmq.url);
    this.channel = await this.connection.createChannel();
  }

  private async setupQueues(): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialised');

    await this.channel.assertQueue(config.rabbitmq.queueName, { durable: true });
    await this.channel.assertExchange(config.rabbitmq.delayExchange, 'direct', { durable: true });
    await this.channel.assertQueue(config.rabbitmq.delayQueue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': config.rabbitmq.queueName,
      },
    });
    await this.channel.bindQueue(config.rabbitmq.delayQueue, config.rabbitmq.delayExchange, 'delay');
  }

  private async consume(): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialised');

    logger.info('Waiting for messages. To exit press CTRL+C');

    await this.channel.consume(config.rabbitmq.queueName, (msg) => {
      if (msg !== null) {
        void this.processMessage(msg).catch(error => {
          logger.error('Error processing message:', error);
        });
      }
    });
  }

  private async processMessage(msg: ConsumeMessage): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialised');

    const content = JSON.parse(msg.content.toString()) as RecipeMessage;
    const { id, title, ingredients } = content;

    try {
      const imageBuffer = await generateImage({ title, ingredients });
      const imageUrl = await this.uploadImageToSupabase(id, imageBuffer);
      await this.updateRecipeWithImageUrl(id, imageUrl);

      logger.info(`Image generated for recipe ${id}`);
      this.channel.ack(msg);
    } catch (error) {
      this.handleProcessingError(error, id, msg);
    }
  }

  private async uploadImageToSupabase(recipeId: string, imageBuffer: Buffer): Promise<string> {
    const { error } = await this.supabase.storage
      .from(config.supabase.bucketName)
      .upload(`${recipeId}.png`, imageBuffer, {
        contentType: 'image/png',
      });

    if (error) throw error;

    const { data: { publicUrl } } = this.supabase.storage
      .from(config.supabase.bucketName)
      .getPublicUrl(`${recipeId}.png`);

    return publicUrl;
  }

  private async updateRecipeWithImageUrl(recipeId: string, imageUrl: string): Promise<void> {
    const { error } = await this.supabase
      .from('recipe_images')
      .insert({ id: recipeId, imageUrl })
      .select();

    if (error) throw error;
  }

  private handleProcessingError(error: unknown, recipeId: string, msg: ConsumeMessage): void {
    if (!this.channel) throw new Error('Channel not initialised');

    if (error instanceof Error) {
      logger.error('Error processing message:', error);

      if (error.message === "Rate limit exceeded") {
        logger.info(`Rate limit hit. Requeueing message for recipe "${recipeId}" with delay`);
        this.requeueWithDelay(msg);
      } else {
        logger.error('Unhandled error:', error);
        this.channel.ack(msg);
      }
    } else {
      logger.error('Unknown error occurred:', error);
      this.channel.ack(msg);
    }
  }

  private requeueWithDelay(msg: ConsumeMessage): void {
    if (!this.channel) throw new Error('Channel not initialised');

    this.channel.publish(config.rabbitmq.delayExchange, 'delay', msg.content, {
      expiration: config.rabbitmq.retryDelay.toString(),
    });
    this.channel.ack(msg);
  }

  private async cleanup(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}

export async function startConsumer(): Promise<void> {
  const consumer = new ImageGenerationConsumer();
  await consumer.start();
}