const PricingStrategy = require('./PricingStrategy');

class LMSRStrategy extends PricingStrategy {
  constructor(b = 100) {
    super();
    this.b = b;
  }

  // Cost function = b * ln(sum(e^(q_i / b)))
  _calculateLMSRCost(qArray) {
    const maxQ = Math.max(...qArray);
    const sumExp = qArray.reduce((acc, q) => {
      return acc + Math.exp((q - maxQ) / this.b);
    }, 0);
    return this.b * (maxQ / this.b + Math.log(sumExp));
  }

  calculateCost(currentShares, targetOutcome, amount) {
    // currentShares is an object like { yesShares: 50, noShares: 50 }
    const sharesArray = Object.values(currentShares);
    const currentCost = this._calculateLMSRCost(sharesArray);

    const newSharesProps = { ...currentShares };
    if (newSharesProps[targetOutcome] === undefined) {
      throw new Error(`Invalid target outcome: ${targetOutcome}`);
    }
    newSharesProps[targetOutcome] += amount;
    
    const newSharesArray = Object.values(newSharesProps);
    const newCost = this._calculateLMSRCost(newSharesArray);

    return newCost - currentCost;
  }

  calculateSlippage(currentShares, targetOutcome, amount) {
    // Slippage can be derived loosely, but for LMSR we just return 0 assuming exact cost represents slip internally
    return 0;
  }
}

module.exports = LMSRStrategy;
