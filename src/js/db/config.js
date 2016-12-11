const config = {
  price: 300,
  minutes: 60,

  get PREVIEW_LENGTH() {
    return document.documentElement.clientWidth > 695 ? 61 : 31;
  },

  get DEFAULT_PRICE_TASK() {
    return this.price;
  },

  set DEFAULT_PRICE_TASK(newPrice) {
    this.price = newPrice;
  },

  get DEFAULT_PRICE_MINUTES() {
    return this.minutes;
  },

  set DEFAULT_PRICE_MINUTES(newMin) {
    this.minutes = newMin;
  },
};

export default config;
