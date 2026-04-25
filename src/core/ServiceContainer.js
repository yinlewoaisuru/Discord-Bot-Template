class ServiceContainer {
  constructor() {
    this._services = new Map();
    this._factories = new Map();
    this._singletons = new Map();
  }

  register(name, instance) {
    this._services.set(name, instance);
    return this;
  }

  factory(name, factoryFn) {
    this._factories.set(name, factoryFn);
    return this;
  }

  singleton(name, factoryFn) {
    this._singletons.set(name, factoryFn);
    return this;
  }

  get(name) {
    if (this._services.has(name)) {
      return this._services.get(name);
    }

    if (this._singletons.has(name)) {
      const instance = this._singletons.get(name)(this);
      this._services.set(name, instance);
      this._singletons.delete(name);
      return instance;
    }

    if (this._factories.has(name)) {
      return this._factories.get(name)(this);
    }

    return null;
  }

  has(name) {
    return this._services.has(name) || this._factories.has(name) || this._singletons.has(name);
  }

  remove(name) {
    this._services.delete(name);
    this._factories.delete(name);
    this._singletons.delete(name);
    return this;
  }

  list() {
    return [
      ...this._services.keys(),
      ...this._factories.keys(),
      ...this._singletons.keys(),
    ];
  }

  clear() {
    this._services.clear();
    this._factories.clear();
    this._singletons.clear();
  }
}

module.exports = ServiceContainer;
