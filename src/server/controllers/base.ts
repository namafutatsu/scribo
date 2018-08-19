import * as jwt from 'jsonwebtoken';
import User from '../models/user';

abstract class BaseCtrl {
  abstract model: any;

  // Get all
  getAll = (req: any, res: any) => {
    this.model.find({}, (err: any, docs: any) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
  }

  getAllAuth = (req: any, res: any) => {
    this.tokenAuth(req, res, () =>
      User.findOne(req.user).exec((err: any, user: any) => {
        this.model.find({ userId: user._id}, (err: any, doc: Document) => {
          if (err) { return console.error(err); }
          res.json(doc);
        });
      })
    );
  }

  // Count all
  count = (req: any, res: any) => {
    this.model.count((err: any, count: any) => {
      if (err) { return console.error(err); }
      res.json(count);
    });
  }

  // Insert
  insert = (req: any, res: any) => {
    const obj = new this.model(req.body);
    obj.save((err: any, item: any) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      res.status(200).json(item);
    });
  }

  insertAuth = (req: any, res: any) => {
    this.tokenAuth(req, res, () =>
      User.findOne(req.user).exec((err: any, user: any) => {
        req.body.userId = user._id;
        const obj = new this.model(req.body);
        obj.save((err: any, item: any) => {
          // 11000 is the code for duplicate key error
          if (err && err.code === 11000) {
            res.sendStatus(400);
          }
          if (err) {
            return console.error(err);
          }
          res.status(200).json(item);
        });
      })
    );
  }

  // Get by id
  get = (req: any, res: any) => {
    this.model.findOne({ _id: req.params.id }, (err: any, obj: any) => {
      if (err) { return console.error(err); }
      res.json(obj);
    });
  }

  getAuth = (req: any, res: any) => {
    this.tokenAuth(req, res, () =>
      User.findOne(req.user).exec((err: any, user: any) => {
        this.model.findOne({ userId: user._id, _id: req.params.id }, (err: any, doc: Document) => {
          if (err) { return console.error(err); }
          res.json(doc);
        });
      })
    );
  }

  // Get by key
  getByKey = (req: any, res: any) => {
    this.model.findOne({ key: req.params.key }, (err: any, obj: any) => {
      if (err) { return console.error(err); }
      res.json(obj);
    });
  }

  getByKeyAuth = (req: any, res: any) => {
    this.tokenAuth(req, res, () =>
      User.findOne(req.user).exec((err: any, user: any) => {
        this.model.findOne({ userId: user._id, key: req.params.key }, (err: any, doc: Document) => {
          if (err) { return console.error(err); }
          res.json(doc);
        });
      })
    );
  }

  // Update by id
  update = (req: any, res: any) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err: any) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }

  updateAuth = (req: any, res: any) => {
    this.tokenAuth(req, res, () =>
      User.findOne(req.user).exec((err: any, user: any) => {
        this.model.findOneAndUpdate({ userId: user._id, _id: req.params.id }, req.body, (err: any) => {
          if (err) { return console.error(err); }
          res.sendStatus(200);
        });
      })
    );
  }

  // Delete by id
  delete = (req: any, res: any) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err: any) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }

  tokenAuth = function(req: any, res: any, next: any) {
    let token;
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        const scheme = parts[0],
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

export default BaseCtrl;
