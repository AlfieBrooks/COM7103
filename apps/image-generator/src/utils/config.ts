export const config = {
  rabbitmq: {
    url: process.env.RABBITMQ_URL!,
    queueName: process.env.RABBITMQ_QUEUE_NAME!,
    delayExchange: 'delay_exchange',
    delayQueue: 'delay_queue',
    retryDelay: 30000,
  },
  supabase: {
    url: process.env.SUPABASE_URL!,
    key: process.env.SUPABASE_KEY!,
    bucketName: 'recipe_images',
  },
};