import type amqp from 'amqplib';
import { connect } from 'amqplib';

let channelInstance: amqp.Channel | null = null;

export async function getRabbitMQInstance(): Promise<amqp.Channel> {
  if (channelInstance) {
    return channelInstance;
  }

  const connection = await connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();
  await channel.assertQueue(process.env.RABBITMQ_QUEUE_NAME!);
  channelInstance = channel;
  return channelInstance;
}