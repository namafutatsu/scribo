import Project from '../models/project';
import BaseCtrl from './base';

export default class ProjectCtrl extends BaseCtrl {
  model = Project;

  getByKey = (req: any, res: any) => {
    this.model.findOne({ key: req.params.key }, (err: any, obj: any) => {
      if (err) { return console.error(err); }
      res.json(obj);
    });
  }
}
