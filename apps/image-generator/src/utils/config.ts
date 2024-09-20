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
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_KEY!,
    jwtSecret: process.env.JWT_SECRET!,
    bucketName: 'recipe_images',
  },
};