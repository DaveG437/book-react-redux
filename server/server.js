import http from 'http';
import { join } from 'path';
import express, { Router as expressRouter } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import denodeify from 'denodeify';
import sqlJS from 'sql.js';
import isomorphic from '_server/isomorphic';

import projectsRoutes from './projects/routes';

const absPath = relPath => join(ROOT_DIR, relPath);
const readFile = denodeify(fs.readFile);

const app = express();
const server = http.createServer(app);

const listen = denodeify(server.listen.bind(server));
const close = denodeify(server.close.bind(server));

const dataRouter = expressRouter();
app.use(REST_API_PATH, bodyParser.json(), dataRouter);

app.use('/bootstrap', express.static(absPath('node_modules/bootstrap/dist')));
app.use(express.static(absPath('public')));

app.use(isomorphic);

app.get('*', (req, res) => res.sendFile(absPath('server/index.html')));

export function start() {
  global.db = new sqlJS.Database();
  return readFile(absPath('server/data.sql'), 'utf8')
  .then(data => db.exec(data))
  .then(() => Promise.all([
    projectsRoutes(dataRouter, '/projects'),
  ]))
  .then(() => listen(PORT));
}
export function stop() {
  return close();
}
