abstract class BaseCtrl {

  abstract model: any;

  // Get all
  getAll = (req: any, res: any) => {
    this.model.find({}, (err: any, docs: any) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
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

  // Get by id
  get = (req: any, res: any) => {
    this.model.findOne({ _id: req.params.id }, (err: any, obj: any) => {
      if (err) { return console.error(err); }
      res.json(obj);
    });
  }

  // Update by id
  update = (req: any, res: any) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err: any) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }

  // Delete by id
  delete = (req: any, res: any) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err: any) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }
}

export default BaseCtrl;
