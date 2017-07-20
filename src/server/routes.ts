import * as express from 'express';

import UserCtrl from './controllers/user';
import User from './models/user';

import ProjectCtrl from './controllers/project';
import Project from './models/project';

export function init(app: express.Application) {
  const router = express.Router();

  const projectCtrl = new ProjectCtrl();
  router.route('/projects').get(projectCtrl.getByUser);
  router.route('/projects/count').get(projectCtrl.count);
  router.route('/project').post(projectCtrl.insert);
  router.route('/project/:key').get(projectCtrl.getByKey);
  router.route('/project/:id').put(projectCtrl.update);
  router.route('/project/:id').delete(projectCtrl.delete);

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
