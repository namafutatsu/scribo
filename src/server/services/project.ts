import * as express from 'express';
import * as DB from "documentdb-typescript";

export function projectServices(app: express.Application) {
  const host = "https://gdrtf.documents.azure.com:443/";
  const authKey = "rjMsABKuzL0H3WVSq7a7PvuC4bVWUjkxSxCySC1mDpmqIUbvDkVhabYA9kt36qYYPatg5y2CPw9QeI5zOLfIQw==";
  const databaseId = "scribo.dev";
  const collectionId = "Projects";

  const client = new DB.Client(host, authKey);
  const collection = new DB.Collection(collectionId, databaseId, client);

  app.get('/api/projects',
    (request:express.Request, response:express.Response) => {
      // collection.queryDocuments("SELECT * FROM root").toArray().then(
      //   o => response.send(o)
      // )
      collection.queryDocuments().toArray().then(
        o => response.send(o)
      )
  });

  app.get('/api/projects/:key',
    (request:express.Request, response:express.Response) => {
      // var querySpec = {
      //   query: 'SELECT * FROM root r WHERE r.key=@key',
      //   parameters: [{
      //       name: '@key',
      //       value: request.params.key
      //   }]
      // };
      // collection.queryDocuments(querySpec).read().then(
      //   o => response.send(o)
      // )
      collection.findDocumentAsync({
        key: request.params.key
      }).then(o => response.send(o))
  });

  app.put('/api/projects/put',
    (req:express.Request, res:express.Response) => {
      collection.storeDocumentAsync(req.body, DB.StoreMode.UpdateOnly).then(
        o => console.log(o)
      )
    });
}