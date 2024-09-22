import type amqp from 'amqplib';
import { connect } from 'amqplib';
import { config } from './config';

let channelInstance: amqp.Channel | null = null;

export async function getRabbitMQInstance(): Promise<amqp.Channel> {
  if (channelInstance) {
    return channelInstance;
  }

  const connection = await connect(config.rabbitmq.url);
  const channel = await connection.createChannel();
  await channel.assertQueue(config.rabbitmq.queueName, { durable: true });
  channelInstance = channel;
  return channelInstance;
}