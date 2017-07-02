import * as express from 'express';

import { MongoClient, Collection } from 'mongodb';

var collection: Collection;

export function projectServices(app: express.Application) {

  MongoClient.connect('mongodb://localhost:27017/Scribo', function(err, database) {
    console.log('Connected correctly to server');
    collection = database.collection('Projects');
  });

  app.get('/api/projects',
    (request:express.Request, response:express.Response) => {
      collection.find({}).toArray(function(err, docs) {
        response.send(docs);
      });
  });

  app.get('/api/projects/:key',
    (request:express.Request, response:express.Response) => {
      collection.findOne({ key: request.params.key }, function(err, doc) {
        response.send(doc);
      });
  });

  app.put('/api/projects/put',
    (req:express.Request, res:express.Response) => {
      delete req.body._id;
      collection.updateOne({ id: req.body.id }, req.body, function (err) {
        if (err) return console.error(err);
      });
  });
}