class EventBus {
  constructor() {
    this._listeners = new Map();
    this._onceListeners = new Map();
  }

  on(event, listener) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(listener);
    return this;
  }

  once(event, listener) {
    if (!this._onceListeners.has(event)) {
      this._onceListeners.set(event, []);
    }
    this._onceListeners.get(event).push(listener);
    return this;
  }

  off(event, listener) {
    if (this._listeners.has(event)) {
      const filtered = this._listeners.get(event).filter(l => l !== listener);
      this._listeners.set(event, filtered);
    }
    if (this._onceListeners.has(event)) {
      const filtered = this._onceListeners.get(event).filter(l => l !== listener);
      this._onceListeners.set(event, filtered);
    }
    return this;
  }

  async emit(event, ...args) {
    const results = [];

    const listeners = this._listeners.get(event) || [];
    for (const listener of listeners) {
      try {
        results.push(await listener(...args));
      } catch (err) {
        results.push(err);
      }
    }

    const onceListeners = this._onceListeners.get(event) || [];
    for (const listener of onceListeners) {
      try {
        results.push(await listener(...args));
      } catch (err) {
        results.push(err);
      }
    }
    this._onceListeners.delete(event);

    return results;
  }

  removeAll(event) {
    if (event) {
      this._listeners.delete(event);
      this._onceListeners.delete(event);
    } else {
      this._listeners.clear();
      this._onceListeners.clear();
    }
    return this;
  }

  listenerCount(event) {
    const normal = (this._listeners.get(event) || []).length;
    const once = (this._onceListeners.get(event) || []).length;
    return normal + once;
  }

  events() {
    return [...new Set([...this._listeners.keys(), ...this._onceListeners.keys()])];
  }
}

module.exports = EventBus;
