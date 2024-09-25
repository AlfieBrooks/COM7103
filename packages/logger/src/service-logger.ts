import pino from 'pino';

const loggerEnvMap = {
  development: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: {
    level: 'warn',
  },
  test: {
    enabled: false,
  },
}

export const logger = pino({
  ...loggerEnvMap[process.env.NODE_ENV as 'development' | 'production' | 'test'],
});