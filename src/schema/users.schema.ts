import crypto from 'crypto';
import { schema, resolve, querySyntax, Infer } from '@feathersjs/schema'

import { HookContext } from '../declarations'
import { LocalStrategy } from '@feathersjs/authentication-local/lib';

// The Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar';
// The size query. Our chat needs 60px images
const query = 's=60';

// Schema and resolver for the basic data model (e.g. creating new entries)
export const userDataSchema = schema({
  $id: 'UserData',
  type: 'object',
  additionalProperties: false,
  required: [ 'email', 'password' ],
  properties: {
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    avatar: {
      type: 'string'
    },
    githubId: {
      type: 'string'
    }
  }
} as const)

export type UserData = Infer<typeof userDataSchema>

export const userDataResolver = resolve<UserData, HookContext>({
  schema: userDataSchema,
  validate: 'before',
  properties: {
    avatar: async (_value, user) => {
      // Gravatar uses MD5 hashes from an email address (all lowercase) to get the image
      const hash = crypto.createHash('md5').update(user.email.toLowerCase()).digest('hex');
      // Return the full avatar URL
      return `${gravatarUrl}/${hash}?${query}`;
    },
    password: async (value, _user, context) => {
      const authService = context.app.service('authentication')
      const localStrategy = authService.getStrategy('local') as LocalStrategy

      return localStrategy.hashPassword(value as string, context.params)
    }
  }
})


// Schema and resolver for making partial updates
export const userPatchSchema = schema({
  $id: 'UserPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...userDataSchema.properties
  }
} as const)

export type UserPatch = Infer<typeof userPatchSchema>

export const userPatchResolver = resolve<UserPatch, HookContext>({
  schema: userPatchSchema,
  validate: 'before',
  properties: {}
})


// Schema and resolver for the data that is being returned
export const userResultSchema = schema({
  $id: 'UserResult',
  type: 'object',
  additionalProperties: false,
  required: [ ...userDataSchema.required, '_id' ],
  properties: {
    ...userDataSchema.definition.properties,
    _id: {
      type: 'string'
    }
  }
} as const)

export type UserResult = Infer<typeof userResultSchema>

export const userResultResolver = resolve<UserResult, HookContext>({
  schema: userResultSchema,
  validate: false,
  properties: {}
})

export const userDispatchResolver = resolve<UserResult, HookContext>({
  properties: {
    password: async () => undefined
  }
});

// Schema and resolver for allowed query properties
export const userQuerySchema = schema({
  $id: 'UserQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(userResultSchema.properties)
  }
} as const)

export type UserQuery = Infer<typeof userQuerySchema>

export const userQueryResolver = resolve<UserQuery, HookContext>({
  schema: userQuerySchema,
  validate: 'before',
  properties: {}
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const userResolvers = {
  dispatch: userDispatchResolver,
  result: userResultResolver,
  data: {
    create: userDataResolver,
    patch: userPatchResolver,
    update: userDataResolver
  },
  query: userQueryResolver
}
