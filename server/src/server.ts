import express, { ErrorRequestHandler } from 'express';
import http from 'http';
import createError from 'http-errors';
import logger from 'morgan';
import { join } from 'path';

import indexRouter from './routes';

import cors from 'cors';

const app = express();

const PORT = process.env.PORT || '3000';

app.use(logger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.use('/', indexRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(((err, req, res, next) => {
  res.status(err.status || 500);
  res.json(err);
}) as ErrorRequestHandler);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(
    'The server is running please open your browser at' +
      ` http://localhost:${PORT} ` +
      'or Press Ctrl-C to terminate.'
  );
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error('Port ' + PORT + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(PORT + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
});
