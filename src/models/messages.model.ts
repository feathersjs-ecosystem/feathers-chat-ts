import NeDB from '@seald-io/nedb';
import path from 'path';
import { Application } from '../declarations';

export default function (app: Application) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'messages.db'),
    autoload: true
  });

  return Model;
}
