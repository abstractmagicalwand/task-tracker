const config = {
  _price: 300,
  _minutes: 60,

  get PREVIEW_LENGTH() {
    return document.documentElement.clientWidth > 695 ? 61 : 31;
  },

  get DEFAULT_PRICE_TASK() {
    return this._price;
  },

  set DEFAULT_PRICE_TASK(newPrice) {
    this._price = newPrice;
  },

  get DEFAULT_PRICE_MINUTES() {
    return this._minutes;
  },

  set DEFAULT_PRICE_MINUTES(newMin) {
    this._minutes = newMin;
  }
};

export {config};