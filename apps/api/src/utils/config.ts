export const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  nodeEnv: process.env.NODE_ENV as "development" | "production" | "test",
  rabbitmq: {
    url: process.env.RABBITMQ_URL!,
    queueName: process.env.RABBITMQ_QUEUE_NAME!,
  },
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_KEY!,
    jwtSecret: process.env.JWT_SECRET!,
    tableName: 'initial_recipes',
  },
  imageApi: {
    url: process.env.IMAGE_API_URL!,
  }
};