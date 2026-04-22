class Market {
  constructor(marketId, title, category, status = 'OPEN', closeTime) {
    this._marketId = marketId;
    this._title = title;
    this._category = category;
    this._status = status;
    this._closeTime = closeTime;
  }

  // Getters for protected fields
  get marketId() { return this._marketId; }
  get title() { return this._title; }
  get category() { return this._category; }
  get status() { return this._status; }
  get closeTime() { return this._closeTime; }

  calculatePrice() {
    throw new Error("Method 'calculatePrice()' must be implemented by concrete subclasses.");
  }

  getStatus() {
    const now = new Date();
    if (this._status === 'OPEN' && this._closeTime && now > new Date(this._closeTime)) {
      return 'LOCKED';
    }
    return this._status;
  }

  lockMarket() {
    if (this._status === 'RESOLVED') throw new Error("Cannot lock a resolved market.");
    this._status = 'LOCKED';
  }

  resolveMarket(outcome) {
    if (this._status === 'RESOLVED') throw new Error("Market is already resolved.");
    this._status = 'RESOLVED';
    this._outcome = outcome;
  }
}

module.exports = Market;
