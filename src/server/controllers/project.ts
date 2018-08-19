import fs = require('fs');
import path = require('path');

import BaseCtrl from './base';
import Project from '../models/project';
import User from '../models/user';
import { octokit } from '..';

const archiver = require('archiver');
const git = require('simple-git/promise');
const tmp = require('tmp');

export default class ProjectCtrl extends BaseCtrl {
  private static octokit: any;
  model = Project;

  getAllInfosAuth = (req: any, res: any) => {
    this.tokenAuth(req, res, () =>
      User.findOne(req.user).exec((err: any, user: any) => {
        this.model.find({ userId: user._id }, {
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

  clone = (user: string, pass: string, project: string, remote: string) => {
    const dir = path.join(tmp.dirSync().name, 'git', user, project);
    git().silent(true)
      .clone(remote, dir)
      .then(() => console.log('finished cloning on ' + dir))
      .catch((err: any) => console.error('failed: ', err));
  }

  cloneGH = (user: string, pass: string, project: string) => {
    const remote = `https://${user}:${pass}@github.com/${user}/${project}`;
    return this.clone(user, pass, project, remote);
  }

  createRepoGH = (user: any, obj: any) => {
    octokit.repos.create({
      name: 'scribo:' + obj.name,
      description: user._id + '/' + obj._id,
      // homepage,
      private: true,
      // has_issues,
      // has_projects,
      // has_wiki,
      // team_id,
      // auto_init,
      // gitignore_template,
      // license_template,
      // allow_squash_merge,
      // allow_merge_commit,
      // allow_rebase_merge
    }).then((res: any) => {
      console.log(res.data);
    });
  }

  exportAuth = (req: any, res: any) => {
    this.tokenAuth(req, res, () =>
      User.findOne(req.user).exec((err: any, user: any) => {
        this.model.findOne({ _id: req.params.id }, (err: any, obj: any) => {
          if (err) { return console.error(err); }
          const dir = tmp.dirSync().name;
          console.log('Dir: ', dir);
          serializeItem(dir, obj);
          console.log('Serialization complete');
          const archive = archiver('zip', {
            zlib: { level: 9 }
          });
          archive.on('warning', function (err: any) {
            if (err.code === 'ENOENT') {
              console.warn(err);
            } else {
              console.error(err);
            }
          });
          archive.on('error', function (err: any) {
            console.error(err);
          });
          archive.on('end', function () {
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
    const subdir = path.join(dir + '/' + item.name);
    fs.mkdirSync(subdir);
    item.sitems.forEach((child: any) => {
      serializeItem(subdir, child);
    });
  } else {
    fs.writeFileSync(dir + '/' + item.name + '.html', item.text);
  }
}
