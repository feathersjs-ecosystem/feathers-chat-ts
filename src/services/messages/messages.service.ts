// Initializes the `messages` service on path `/messages`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Messages } from './messages.class';
import createModel from '../../models/messages.model';
import hooks from './messages.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'messages': Messages & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/messages', new Messages(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('messages');

  service.hooks(hooks);
}
