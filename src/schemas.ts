import crypto from 'crypto';
import { schema, property, Type } from '@feathersjs/schema';
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
  id: string;

  @property(validator => validator.email().required())
  email: string;

  @property(validator => validator.default((user: User) => {
    const hash = crypto.createHash('md5')
      .update(user.email.toLowerCase())
      .digest('hex');
    // The full avatar URL
    return `${gravatarUrl}/${hash}?${query}`;
  }))
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
  @property(validator => validator.required().max(400))
  text: string;

  @property(validator => validator.required().ref('$params.user._id'))
  userId: string;

  @property(validator => validator.default(() => new Date()))
  createdAt: Date;

  @property({
    async resolve (message: Message, context: HookContext) {
      return context.app.service('users')
        .get(message.userId, context.params);
    }
  })
  user: User;
}
