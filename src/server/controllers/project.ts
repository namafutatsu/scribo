import Project from '../models/project';
import BaseCtrl from './base';

import * as jwt from 'jsonwebtoken';
import User from '../models/user';

export default class ProjectCtrl extends BaseCtrl {
  model = Project;

  getByKey = (req: any, res: any) => {
    this.model.findOne({ key: req.params.key }, (err: any, obj: any) => {
      if (err) { return console.error(err); }
      res.json(obj);
    });
  }

  getByUser = (req: any, res: any) => {
    this.tokenAuth(req, res, () =>
      User.findOne(req.user).exec((err: any, user: any) => {
        this.model.find({ userId: user._id}, (err: any, project: Document) => {
          if (err) { return console.error(err); }
          res.json(project);
        });
      })
    );
  }

  tokenAuth = function(req: any, res: any, next: any) {
    var token;

    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        var scheme = parts[0],
        credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      } else {
        return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
      }
    } else if (req.param('token')) {
      token = req.param('token');
      delete req.query.token;
    } else {
      return res.json(401, {err: 'No Authorization header was found'});
    }

    jwt.verify(token, 'shhhhhh', {}, function(err: any, decoded: any) {
      if (err) return res.json(401, {err: 'The token is not valid'});
      req.user = decoded.user;
      next();
    });
  };
}
