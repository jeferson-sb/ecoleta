import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import { errors } from 'celebrate';

import routes from './routes';
import config from './config';

const app = express();
const staticFilesPath = path.resolve(__dirname, '..', 'uploads');

app
  .use(cors())
  .use(express.json())
  .use(morgan('dev'))
  .use('/api', routes)
  .use('/uploads', express.static(staticFilesPath))
  .use(errors());

app.listen(config.port, () =>
  console.log(
    `Server is up and running in ${config.mode} mode on http://${config.host}:${config.port}`
  )
);
