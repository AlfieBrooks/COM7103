import { logger } from '@repo/logger';

import { main } from './server';
import { gracefullyShutdown, unexpectedErrorHandler } from './utils/exit-handler';
import { config } from './utils/config';

main()
  .then((app) => {
    process.on('uncaughtException', (err) => {
      unexpectedErrorHandler(app, err);
    });
    process.on('unhandledRejection', (err) => {
      unexpectedErrorHandler(app, err);
    });
    process.on('SIGTERM', () => {
      gracefullyShutdown(app);
    });
    process.on('SIGINT', () => {
      gracefullyShutdown(app);
    });

    const { port, host } = config;

    app
      .listen({ port, host })
      .then((_) => {
        app.log.info('Ready, Waiting for connections...');
      })
      .catch((err) => {
        app.log.error(
          {
            host,
            port,
            error: err.message,
          },
          'Failed to start server',
        );
      });
  })
  .catch((err) => {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  });
