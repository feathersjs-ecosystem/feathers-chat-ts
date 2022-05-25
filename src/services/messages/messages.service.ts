// Initializes the `messages` service on path `/messages`
import { Params, ServiceInterface } from '@feathersjs/feathers';
import { resolveAll } from '@feathersjs/schema';

import { Application } from '../../declarations';
import { Messages } from './messages.class';
import createModel from '../../models/messages.model';
import hooks from './messages.hooks';
import { messageResolvers, MessageData, MessageResult, MessageQuery } from '../../schema/messages.schema';

type MessageService = ServiceInterface<MessageResult, MessageData, Params<MessageQuery>>

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'messages': MessageService
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
  app.use('messages', new Messages(options, app) as MessageService);

  // Get our initialized service so that we can register hooks
  const service = app.service('messages');

  service.hooks([
    resolveAll(messageResolvers)
  ]);
  service.hooks(hooks);
}
