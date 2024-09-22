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
    this.supabase = createClient(config.supabase.url, config.supabase.serviceKey);
    logger.info('Supabase client created');
  }

  async start(): Promise<void> {
    try {
      logger.info('Starting consumer');
      await this.connect();
      await this.setupQueues();
      await this.consume();
    } catch (error) {
      logger.error(error, 'Failed to start consumer');
      await this.cleanup();
    }
  }

  private async connect(): Promise<void> {
    logger.info('Connecting to RabbitMQ');
    this.connection = await connect(config.rabbitmq.url);
    this.channel = await this.connection.createChannel();
    logger.info('RabbitMQ connection and channel established');
  }

  private async setupQueues(): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialised');

    logger.info('Setting up queues');
    await this.channel.assertQueue(config.rabbitmq.queueName, { durable: true });
    logger.info(`Queue ${config.rabbitmq.queueName} asserted`);
    await this.channel.assertExchange(config.rabbitmq.delayExchange, 'direct', { durable: true });
    logger.info(`Exchange ${config.rabbitmq.delayExchange} asserted`);
    await this.channel.assertQueue(config.rabbitmq.delayQueue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': config.rabbitmq.queueName,
      },
    });
    logger.info(`Delay queue ${config.rabbitmq.delayQueue} asserted`);
    await this.channel.bindQueue(config.rabbitmq.delayQueue, config.rabbitmq.delayExchange, 'delay');
    logger.info(`Queue ${config.rabbitmq.delayQueue} bound to exchange ${config.rabbitmq.delayExchange}`);
  }

  private async consume(): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialised');

    logger.info('Waiting for messages. To exit press CTRL+C');

    await this.channel.consume(config.rabbitmq.queueName, (msg) => {
      if (msg !== null) {
        logger.info(`Received message: ${msg.content.toString()}`);
        void this.processMessage(msg).catch(error => {
          logger.error(error, 'Error processing message');
        });
      }
    });
  }

  private async processMessage(msg: ConsumeMessage): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialised');

    const content = JSON.parse(msg.content.toString()) as RecipeMessage;
    const { id, title, ingredients } = content;
    logger.info(`Processing message with id: ${id}, title: ${title}`);

    try {
      const imageBuffer = await generateImage({ title, ingredients });
      await this.uploadToStorage(id, imageBuffer);
      await this.insertToDatabase(id);

      logger.info(`Image generated for recipe ${id}`);
      this.channel.ack(msg);
    } catch (error) {
      this.handleProcessingError(error, id, msg);
    }
  }

  private async uploadToStorage(recipeId: string, imageBuffer: Buffer): Promise<void> {
    const { error: storageError } = await this.supabase.storage
      .from(config.supabase.bucketName)
      .upload(`${recipeId}.png`, imageBuffer, {
        contentType: 'image/png',
      });

    if (storageError) throw storageError;

    logger.info(`Recipe ${recipeId} uploaded to Supabase storage`);
  }

  private async insertToDatabase(recipeId: string): Promise<void> {
    const { error: dbError } = await this.supabase
      .from('recipe_images')
      .insert({ id: recipeId })
      .select();

    if (dbError) throw dbError;

    logger.info(`Recipe ${recipeId} created in database`);
  }

  private handleProcessingError(error: unknown, recipeId: string, msg: ConsumeMessage): void {
    if (!this.channel) throw new Error('Channel not initialised');

    if (error instanceof Error) {
      logger.error(error, 'Error processing message');

      if (error.message === "Rate limit exceeded") {
        logger.info(`Rate limit hit. Requeueing message for recipe "${recipeId}" with delay`);
        this.requeueWithDelay(msg);
      } else {
        logger.error(error, 'Unhandled error occurred');
        this.channel.ack(msg);
      }
    } else {
      logger.error(error, 'Unknown error occurred');
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
    if (this.channel) {
      await this.channel.close();
      logger.info('RabbitMQ channel closed');
    }

    if (this.connection) {
      await this.connection.close();
      logger.info('RabbitMQ connection closed');
    }

    throw new Error('Consumer failed to start');
  }
}

export async function startConsumer(): Promise<void> {
  const consumer = new ImageGenerationConsumer();
  await consumer.start();
}