import { main } from "./server"
import { gracefullyShutdown, unexpectedErrorHandler } from './utils/exit-handler';

main()
  .then(app => {
    process.on('uncaughtException', (err) => { unexpectedErrorHandler(app, err); })
    process.on('unhandledRejection', (err) => { unexpectedErrorHandler(app, err); })
    process.on('SIGTERM', () => { gracefullyShutdown(app); })
    process.on('SIGINT', () => { gracefullyShutdown(app); })

    app.listen({ port: process.env.PORT, host: process.env.HOST })
      .then((_) => {
        app.log.info('Ready, Waiting for connections...')
      })
      .catch((err) => {
        app.log.error({
          host: process.env.HOST,
          port: process.env.PORT,
          error: err.message,
        }, 'Failed to start server')
      });
  })
  .catch(err => { console.log(err); process.exit(1); })