import { main } from './server';

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
