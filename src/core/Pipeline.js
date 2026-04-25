class Pipeline {
  constructor() {
    this._middleware = [];
  }

  use(middleware) {
    this._middleware.push(middleware);
    return this;
  }

  async execute(context) {
    let index = 0;

    const next = async () => {
      if (index >= this._middleware.length) return;
      const current = this._middleware[index++];
      await current(context, next);
    };

    await next();
    return context;
  }

  clear() {
    this._middleware = [];
    return this;
  }

  get size() {
    return this._middleware.length;
  }
}

module.exports = Pipeline;
