import capcon from 'capture-console';
import cors from 'cors';
import DBG from 'debug';
import dotenv from 'dotenv';
import express, { ErrorRequestHandler } from 'express';
import fs from 'fs/promises';
import http from 'http';
import createError from 'http-errors';
import logger from 'morgan';
import { join } from 'path';
import { createStream } from 'rotating-file-stream';
import util from 'util';

import { useModel } from './models/store';
import indexRouter from './routes';

const debug = DBG('todos:debug');
const dbgError = DBG('todos:error');

dotenv.config();

capcon.startCapture(process.stdout, async stdout => {
  await fs.appendFile('stdout.txt', stdout, 'utf8');
});

capcon.startCapture(process.stderr, async stderr => {
  await fs.appendFile('stderr.txt', stderr, 'utf8');
});

useModel(process.env.MODEL ? process.env.MODEL : 'memory')
  .then(() => debug('Model loaded successfully'))
  .catch(error => onError({ ...error, code: 'ESTORE' }));

const app = express();

const PORT = process.env.PORT || '3000';

app.use(
  logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
    stream: process.env.REQUEST_LOG_FILE
      ? createStream(process.env.REQUEST_LOG_FILE, {
          size: '10M', // rotate every 10 MegaBytes written
          interval: '1d', // rotate daily
          compress: 'gzip',
        })
      : process.stdout,
  })
);

if (process.env.REQUEST_LOG_FILE) {
  app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev'));
}

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

process.on('uncaughtException', function (err) {
  console.error(`Crashed!!! - ${err.stack || err}`);
});

process.on('unhandledRejection', (reason, p) => {
  console.error(`Unhandled Rejection at: ${util.inspect(p)} reason:
  ${reason}`);
});

const onError = (error: NodeJS.ErrnoException) => {
  dbgError(error);
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
    case 'ESTORE':
      console.error(`Data store initialization failure because `, error);
      process.exit(1);
    default:
      throw error;
  }
};

server.on('error', onError);
