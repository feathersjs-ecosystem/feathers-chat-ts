import { schema, resolve, querySyntax, Infer } from '@feathersjs/schema'
import { HookContext } from '../declarations'
import { UserResult } from './users.schema'

// Schema and resolver for the basic data model (e.g. creating new entries)
export const messageDataSchema = schema({
  $id: 'messageData',
  type: 'object',
  additionalProperties: false,
  required: [ 'text' ],
  properties: {
    text: {
      type: 'string'
    },
    userId: {
      type: 'string'
    },
    createdAt: {
      type: 'string'
    }
  }
} as const)

export type MessageData = Infer<typeof messageDataSchema>

export const messageDataResolver = resolve<MessageData, HookContext>({
  schema: messageDataSchema,
  validate: 'before',
  properties: {
    userId: async (_value, _message, context) => {
      return context.params.user._id;
    }
  }
})


// Schema and resolver for making partial updates
export const messagePatchSchema = schema({
  $id: 'messagePatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...messageDataSchema.properties
  }
} as const)

export type MessagePatch = Infer<typeof messagePatchSchema>

export const messagePatchResolver = resolve<MessagePatch, HookContext>({
  schema: messagePatchSchema,
  validate: 'before',
  properties: {}
})


// Schema and resolver for the data that is being returned
export const messageResultSchema = schema({
  $id: 'messageResult',
  type: 'object',
  additionalProperties: false,
  required: [ ...messageDataSchema.required, 'userId', '_id' ],
  properties: {
    ...messageDataSchema.definition.properties,
    _id: {
      type: 'string'
    }
  }
} as const)

export type MessageResult = Infer<typeof messageResultSchema> & {
  user: UserResult
}

export const messageResultResolver = resolve<MessageResult, HookContext>({
  schema: messageResultSchema,
  validate: false,
  properties: {
    user: async (_value, message, context) => {
      return context.app.service('users').get(message.userId);
    }
  }
})

export const messageDispatchResolver = resolve<MessageResult, HookContext>({
  properties: {}
})

// Schema and resolver for allowed query properties
export const messageQuerySchema = schema({
  $id: 'messageQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(messageResultSchema.properties)
  }
} as const)

export type MessageQuery = Infer<typeof messageQuerySchema>

export const messageQueryResolver = resolve<MessageQuery, HookContext>({
  schema: messageQuerySchema,
  validate: 'before',
  properties: {}
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const messageResolvers = {
  dispatch: messageDispatchResolver,
  result: messageResultResolver,
  data: {
    create: messageDataResolver,
    update: messageDataResolver,
    patch: messagePatchResolver
  },
  query: messageQueryResolver
}
