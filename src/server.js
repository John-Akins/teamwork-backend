import http from 'http'; // import Node native http package
import config from 'dotenv';
import app from './app';

config.config();

// returns a valid port
// whether port is passed as number or a string
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '8080');

app.set('port', port);

// checks for various errors and handles them appropriately,
// also registers them to the server
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
   const bind = typeof address === 'string' ? `pipe ${  address}` : `port: ${  port}`;
  switch (error.code) {
    case 'EACCES':
      //      console.error(`${bind  }requires elevated priviledges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      //      console.error(`${bind  }is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

// set server to listen with either production or local port
server.listen(port);
