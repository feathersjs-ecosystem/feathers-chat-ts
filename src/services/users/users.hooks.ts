import { authenticate } from '@feathersjs/authentication';
import { resolveAll } from '@feathersjs/schema';
import { userResolvers } from '../../schema/users.schema'

export default {
  around: {
    all: [],
    find: [
      authenticate('jwt'),
      resolveAll(userResolvers)
    ],
    get: [
      authenticate('jwt'),
      resolveAll(userResolvers)
    ],
    create: [
      resolveAll(userResolvers)
    ],
    update: [
      authenticate('jwt'),
      resolveAll(userResolvers)
    ],
    patch: [
      authenticate('jwt'),
      resolveAll(userResolvers)
    ],
    remove: [
      authenticate('jwt'),
      resolveAll(userResolvers)
    ],
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
