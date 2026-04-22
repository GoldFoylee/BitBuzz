class PricingStrategy {
  calculateCost() {
    throw new Error("Method 'calculateCost()' must be implemented by concrete subclasses.");
  }

  calculateSlippage() {
    throw new Error("Method 'calculateSlippage()' must be implemented by concrete subclasses.");
  }
}

module.exports = PricingStrategy;
