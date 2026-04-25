const BaseService = require('../core/BaseService');
const LRUCache = require('../utils/cache');

class SnipeService extends BaseService {
  constructor(client) {
    super(client);
    this._deleted = new LRUCache(100, 600_000);
    this._edited = new LRUCache(100, 600_000);
  }

  addDeleted(channelId, message) {
    const stack = this._deleted.get(channelId) || [];
    stack.unshift({ content: message.content, author: message.author?.tag, authorId: message.author?.id, avatar: message.author?.displayAvatarURL(), attachments: [...message.attachments.values()].map(a => a.url), timestamp: Date.now() });
    if (stack.length > 10) stack.pop();
    this._deleted.set(channelId, stack);
  }

  addEdited(channelId, oldMessage, newMessage) {
    const stack = this._edited.get(channelId) || [];
    stack.unshift({ oldContent: oldMessage.content, newContent: newMessage.content, author: newMessage.author?.tag, authorId: newMessage.author?.id, avatar: newMessage.author?.displayAvatarURL(), timestamp: Date.now() });
    if (stack.length > 10) stack.pop();
    this._edited.set(channelId, stack);
  }

  getDeleted(channelId, index = 0) {
    const stack = this._deleted.get(channelId);
    if (!stack || !stack[index]) return null;
    return stack[index];
  }

  getEdited(channelId, index = 0) {
    const stack = this._edited.get(channelId);
    if (!stack || !stack[index]) return null;
    return stack[index];
  }
}

module.exports = SnipeService;
