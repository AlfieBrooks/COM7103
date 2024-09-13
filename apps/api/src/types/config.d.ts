import { FastifyInstance } from 'fastify';
import type fastifyJWT from '@fastify/jwt';
import type { User } from '@supabase/supabase-js';

interface SupabaseUser extends User {
  sub: string
}

declare module 'fastify' {
  export interface FastifyRequest {
    jwt: fastifyJWT;
    supabaseUser: SupabaseUser;
  }

  export interface FastifyInstance {
    supabaseClient: SupabaseClient;
    authenticate: FastifyMiddleware;
    config: {
      NODE_ENV: 'development' | 'production';
      PORT: number;
      HOST: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_KEY: string;
      JWT_SECRET: string;
    };
  }
}
