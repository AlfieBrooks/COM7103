import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      NODE_ENV: 'development' | 'production';
      PORT: number;
      HOST: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      JWT_SECRET: string;
    };
  }
}