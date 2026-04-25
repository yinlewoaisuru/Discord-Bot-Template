class BaseService {
  constructor(client) {
    this.client = client;
  }

  get container() {
    return this.client.container;
  }

  get eventBus() {
    return this.client.eventBus;
  }

  getService(name) {
    return this.client.container.get(name);
  }

  async initialize() {}

  async destroy() {}
}

module.exports = BaseService;
