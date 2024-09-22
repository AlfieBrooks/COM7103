import { main } from './server';
import { gracefullyShutdown, unexpectedErrorHandler } from './utils/exit-handler';
import { logger } from './utils/logger';

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

    app
      .listen({ port: process.env.PORT, host: process.env.HOST })
      .then((_) => {
        app.log.info('Ready, Waiting for connections...');
      })
      .catch((err) => {
        app.log.error(
          {
            host: process.env.HOST,
            port: process.env.PORT,
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
