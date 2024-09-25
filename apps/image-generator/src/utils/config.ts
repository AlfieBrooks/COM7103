export const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  nodeEnv: process.env.NODE_ENV as "development" | "production" | "test",
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