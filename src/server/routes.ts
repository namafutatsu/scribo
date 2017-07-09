import * as express from 'express';

import UserCtrl from './controllers/user';
import User from './models/user';

import ProjectCtrl from './controllers/project';
import Project from './models/project';

export function init(app: express.Application) {
  const router = express.Router();

  const projectCtrl = new ProjectCtrl();
  router.route('/projects').get(projectCtrl.getAll);
  router.route('/projects/count').get(projectCtrl.count);
  router.route('/projects').post(projectCtrl.insert);
  router.route('/projects/:key').get(projectCtrl.getByKey);
  router.route('/projects/:id').put(projectCtrl.update);
  router.route('/projects/:id').delete(projectCtrl.delete);

  const userCtrl = new UserCtrl();
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  app.use('/api', router);

}
