const createServer = require('./app/create-server');

const start = async () => {
  const app = await createServer();

  app.listen(process.env.PORT || 3000, () => {
    process.stdout.write(`Listening to HTTP on port ${process.env.PORT || 3000}\n`);
  });
};

start();
