import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req: any, res: any) => {
    this.model.findOne({ email: req.body.email }, (err: any, user: any) => {
      if (!user) { return res.sendStatus(403); }
      user.comparePassword(req.body.password, (error: any, match: any) => {
        if (!match) { return res.sendStatus(403); }
        const payload: any = { user: user };
        const token = jwt.sign(payload, 'shhhhhh'); // , { expiresIn: 10 } seconds
        res.status(200).json({ token: token });
      });
    });
  }

}
