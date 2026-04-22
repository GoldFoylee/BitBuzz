const Market = require('./Market');

class MultiChoiceMarket extends Market {
  constructor(marketId, title, category, status, closeTime, optionPools) {
    super(marketId, title, category, status, closeTime);
    // optionPools is a Map of outcomeName -> shares
    this.optionPools = new Map(Object.entries(optionPools || {}));
  }

  calculatePrice(b = 100) {
    // For N outcomes
    const sharesArray = Array.from(this.optionPools.values());
    const maxShares = Math.max(...sharesArray);
    
    // Denominator = sum(e^(q_i / b))
    const denominator = sharesArray.reduce((acc, q) => {
      return acc + Math.exp((q - maxShares) / b);
    }, 0);

    const probabilities = new Map();
    for (const [outcome, shares] of this.optionPools.entries()) {
      const expOutcome = Math.exp((shares - maxShares) / b);
      probabilities.set(outcome, expOutcome / denominator);
    }
    return probabilities;
  }
}

module.exports = MultiChoiceMarket;
