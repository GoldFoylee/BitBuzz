const Market = require('./Market');

class BinaryMarket extends Market {
  constructor(marketId, title, category, status, closeTime, yesShares, noShares) {
    super(marketId, title, category, status, closeTime);
    this.yesShares = parseFloat(yesShares);
    this.noShares = parseFloat(noShares);
  }

  calculatePrice(b = 100) {
    // b is the liquidity parameter, LMSR base cost is b * ln(e^(x/b) + e^(y/b))
    // We delegate the actual cost calculation to the PricingStrategy in TradeProcessor, 
    // but the market itself can expose implied probabilities.
    return this.getImpliedProbability(b);
  }

  getImpliedProbability(b = 100) {
    // Probability of YES = e^(yesShares / b) / (e^(yesShares / b) + e^(noShares / b))
    // To prevent overflow, we can subtract the maximum before exp:
    const maxShares = Math.max(this.yesShares, this.noShares);
    const expYes = Math.exp((this.yesShares - maxShares) / b);
    const expNo = Math.exp((this.noShares - maxShares) / b);
    return expYes / (expNo + expYes);
  }
}

module.exports = BinaryMarket;
