const { promisify } = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const readdir = promisify(fs.readdir);

const httpMethods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'];

const validateBundle = (bundle, name) => {
  if (!httpMethods.includes(bundle.method.toUpperCase())) {
    throw new Error(`Expected bundle ${name} to expose valid HTTP Method, instead got ${bundle.method}.`);
  }

  if (typeof bundle.route !== 'string') {
    throw new Error(`Expected bundle ${name} to expose a valid Route, instead got ${bundle.route}.`);
  }

  if (typeof bundle.handler !== 'function') {
    throw new Error(
      `Expected bundle ${name} to expose a valid HTTP Endpoint Handler (Function), instead got ${typeof bundle.handler}.`
    );
  }
};

/**
 * Reads all commands and queries and adds the routes and endpoint handlers to the express app.
 * @param {express.app}
 */
module.exports = async () => {
  const app = express();
  app.use(bodyParser.json());

  const commands = await readdir(path.resolve(__dirname, '..', 'commands'));
  const queries = await readdir(path.resolve(__dirname, '..', 'queries'));

  const files = []
    .concat(commands.map(command => path.resolve(__dirname, '..', 'commands', command)))
    .concat(queries.map(query => path.resolve(__dirname, '..', 'queries', query)));

  const handlers = files.map(filePath => {
    const bundle = require(filePath);
    validateBundle(bundle, path.basename(filePath));
    app[bundle.method](bundle.route, bundle.handler);
  });

  return app;
};
