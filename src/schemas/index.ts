import crypto from 'crypto';
import Joi from '@hapi/joi';
import { schema, property } from '@feathersjs/schema';
import { HookContext } from '@feathersjs/feathers';

// The Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar';
// The size query. Our chat needs 60px images
const query = 's=60';

@schema({
  name: 'users'
})
export class User {
  @property()
  _id: string;

  // `validator` is a Hapi Joi validator for the appropriate type
  @property<Joi.StringSchema>(validator => validator.email().required())
  email: string;

  @property({
    value: (current: string, user: User) => {
      // If there is an avatar value, return it
      if (current && current.length) {
        return current;
      }

      // Returns the Gravatar URL as the default
      const hash = crypto.createHash('md5')
        .update(user.email.toLowerCase())
        .digest('hex');
      // The full avatar URL
      return `${gravatarUrl}/${hash}?${query}`;
    }
  })
  avatar: string;

  @property(validator => validator.required())
  password: string;

  @property()
  githubId: string;
}

@schema({
  name: 'messages'
})
export class Message {
  @property()
  _id: string;

  @property<Joi.StringSchema>(validator => validator.required().max(400))
  text: string;

  @property(validator => validator.required(), {
    // Always associate to the authenticated user
    value: (context: HookContext) => context.params?.user?._id
  })
  userId: string;

  @property({
    // Return a default (current date)
    value: (current: Date = new Date()) => current
  })
  createdAt: Date;

  @property({
    async resolve (message: Message, context: HookContext) {
      // Get params but without the query
      const { query, ...params } = context.params;

      return context.app.service('users')
        .get(message.userId, params);
    }
  })
  user: User;
}
