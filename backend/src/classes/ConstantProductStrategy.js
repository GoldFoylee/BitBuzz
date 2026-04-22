const PricingStrategy = require('./PricingStrategy');

class ConstantProductStrategy extends PricingStrategy {
  // Simple x * y = k implementation
  calculateCost(currentShares, targetOutcome, amount) {
    const keys = Object.keys(currentShares);
    if (keys.length !== 2) throw new Error("Constant product only supports binary markets.");

    const activeKey = targetOutcome;
    const passiveKey = keys.find(k => k !== activeKey);

    const reserveActive = currentShares[activeKey];
    const reservePassive = currentShares[passiveKey];
    
    // We want `amount` shares of activeKey.
    // In constant product pool, normally user buys outcome by adding liquidity to the other side.
    // Simplifying: cost in credits to get `amount` shares.
    // To keep simple and parallel to LMSR interface, we return a simulated cost.
    const k = reserveActive * reservePassive;
    const newReserveActive = reserveActive - amount;
    if (newReserveActive <= 0) throw new Error("Insufficient liquidity.");
    
    const newReservePassive = k / newReserveActive;
    const deltaPassive = newReservePassive - reservePassive;
    
    // Return cost in terms of expected credits 
    return deltaPassive;
  }

  calculateSlippage() {
    return 0.1; // simulated
  }
}

module.exports = ConstantProductStrategy;
