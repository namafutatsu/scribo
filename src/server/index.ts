import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';
import * as mongoose from 'mongoose';
import * as fs from 'fs';

import * as routes from './routes';
// import { gdrtfCredentials } from './gh-credentials';

// const fs = require('fs');
export const octokit = require('@octokit/rest')();

/**
 * Client Dir
 * @note `dev` default.
 */
let _clientDir = '../../client/dev';
const app = express();

export function init(port: number, mode: string) {

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.text());
  app.use(compression());

  // app.set('dbUrl', 'mongodb://localhost:27017/Scribo');
  app.set('dbUrl', 'mongodb://dev:dev@ds123662.mlab.com:23662/scribs');

  mongoose.connect(app.get('dbUrl'));
  const db = mongoose.connection;
  (<any>mongoose).Promise = global.Promise;

  function ghAuthenticate(err: any, data: any) {
    if (err) {
      console.error(err);
      throw err;
    }
    const json = JSON.parse(data);
    class GHCredentials {
      USER: string;
      PASS: string;
      [key: string]: string;
    }
    const ghCredentials = new GHCredentials();
    for (const prop in json)
      ghCredentials[prop] = json[prop];
    octokit.authenticate({
      type: 'basic',
      username: ghCredentials.USER,
      password: ghCredentials.PASS
    });
  }
  fs.readFile('./gh-credentials.json', ghAuthenticate);

  /**
   * Dev Mode.
   * @note Dev server will only give for you middleware.
   */
  if (mode === 'dev') {

    app.all('/*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
      next();
    });

    routes.init(app);

    const root = path.resolve(process.cwd());
    const clientRoot = path.resolve(process.cwd(), './dist/client/dev');
    app.use(express.static(root));
    app.use(express.static(clientRoot));

    const devRenderIndex = (req: express.Request, res: express.Response) => {
      res.sendFile(path.resolve(__dirname, _clientDir + '/index.html'));
    };
    app.get('/*', devRenderIndex);

    /**
     * Api Routes for `Development`.
     */
  } else {
    /**
     * Prod Mode.
     * @note Prod mod will give you static + middleware.
     */

    /**
     * Api Routes for `Production`.
     */
    routes.init(app);

    /**
     * Client Dir
     */
    _clientDir = '../../client/prod';

    /**
     * Static.
     */
    app.use('/js', express.static(path.resolve(__dirname, _clientDir + '/js')));
    app.use('/css', express.static(path.resolve(__dirname, _clientDir + '/css')));
    app.use('/assets', express.static(path.resolve(__dirname, _clientDir + '/assets')));

    /**
     * Spa Res Sender.
     * @param req {any}
     * @param res {any}
     */
    const prodRenderIndex = function (req: express.Request, res: express.Response) {
      res.sendFile(path.resolve(__dirname, _clientDir + '/index.html'));
    };

    /**
     * Prevent server routing and use @ng2-router.
     */
    app.get('/*', prodRenderIndex);
  }

  /**
   * Server with gzip compression.
   */
  return new Promise<http.Server>((resolve, reject) => {
    const server = app.listen(port, () => {
      // var port = server.address().port;
      console.log('App is listening on port:' + port);
      resolve(server);
    });
  });
}
