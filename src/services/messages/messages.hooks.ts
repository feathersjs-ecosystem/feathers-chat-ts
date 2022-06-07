import { authenticate } from '@feathersjs/authentication';
import { resolveAll } from '@feathersjs/schema';
import { messageResolvers } from '../../schema/messages.schema';

export default {
  around: {
    all: [
      authenticate('jwt'),
      resolveAll(messageResolvers)
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
