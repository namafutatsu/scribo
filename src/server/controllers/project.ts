import fs = require('fs');
import path = require('path');
var archiver = require('archiver');
var tmp = require('tmp');

import BaseCtrl from './base';
import Project from '../models/project';
import User from '../models/user';

export default class ProjectCtrl extends BaseCtrl {
  model = Project;

  getAllInfosAuth = (req: any, res: any) => {
    this.tokenAuth(req, res, () =>
      User.findOne(req.user).exec((err: any, user: any) => {
        this.model.find({ userId: user._id}, {
          _id: true,
          id: true,
          key: true,
          name: true
        }, (err: any, doc: Document) => {
          if (err) { return console.error(err); }
          res.json(doc);
        });
      })
    );
  }

  exportAuth = (req: any, res: any) => {
    this.tokenAuth(req, res, () =>
      User.findOne(req.user).exec((err: any, user: any) => {
        this.model.findOne({ _id: req.params.id }, (err: any, obj: any) => {
          if (err) { return console.error(err); }
          let dir = tmp.dirSync().name;
          console.log('Dir: ', dir);
          serializeItem(dir, obj);
          console.log('Serialization complete');
          let archive = archiver('zip', {
              zlib: { level: 9 }
          });
          archive.on('warning', function(err: any) {
            if (err.code === 'ENOENT') {
              console.warn(err);
            } else {
              console.error(err);
            }
          });
          archive.on('error', function(err: any) {
            console.error(err);
          });
          archive.on('end', function() {
            console.log('Archive wrote %d bytes', archive.pointer());
          });
          res.attachment(obj.key + '.zip');
          archive.pipe(res);
          archive.directory(path.join(dir, obj.name), obj.name);
          archive.finalize();
        });
      })
    );
  }
}

function serializeItem(dir: string, item: any) {
  if (item.discriminator === 0) {
    let subdir = path.join(dir + '/' + item.name);
    fs.mkdirSync(subdir);
    item.sitems.forEach((child: any) => {
      serializeItem(subdir, child);
    });
  } else {
    fs.writeFileSync(dir + '/' + item.name + '.html', item.text);
  }
}
