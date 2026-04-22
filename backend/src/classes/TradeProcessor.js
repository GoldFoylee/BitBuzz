const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  transactionOptions: {
    timeout: 10000,
    maxWait: 5000,
  }
});

class TradeProcessor {
  constructor(pricingStrategy) {
    this.strategy = pricingStrategy;
  }

  async executeTrade(userId, marketId, outcome, amountStr) {
    const amount = parseFloat(amountStr);
    if (amount <= 0) throw new Error("Amount must be greater than 0");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const pool = await prisma.marketPool.findUnique({
      where: { marketId },
      include: { market: true }
    });
    if (!pool) throw new Error("Market pool not found");
    if (pool.market.status !== 'OPEN') throw new Error("Market is not OPEN");

    const currentShares = {
      YES: parseFloat(pool.yesShares.toString()),
      NO: parseFloat(pool.noShares.toString())
    };
    
    if (!currentShares[outcome]) throw new Error("Invalid outcome.");

    const cost = this.strategy.calculateCost(currentShares, outcome, amount);

    if (parseFloat(user.buzzCredits.toString()) < cost) {
      throw new Error("Insufficient buzzCredits");
    }

    const poolUpdateData = {};
    if (outcome === 'YES') {
      poolUpdateData.yesShares = { increment: amount };
    } else {
      poolUpdateData.noShares = { increment: amount };
    }

    const existingPosition = await prisma.position.findUnique({
      where: { userId_marketId_outcome: { userId, marketId, outcome } }
    });

    let positionUpsert;
    if (existingPosition) {
      const currentSharesOwned = parseFloat(existingPosition.sharesOwned.toString());
      const currentAvgPrice = parseFloat(existingPosition.avgEntryPrice.toString());
      const totalCostBefore = currentSharesOwned * currentAvgPrice;
      const newTotalShares = currentSharesOwned + amount;
      const newTotalCost = totalCostBefore + cost;
      const newAvgPrice = newTotalCost / newTotalShares;

      positionUpsert = prisma.position.update({
        where: { id: existingPosition.id },
        data: {
          sharesOwned: newTotalShares,
          avgEntryPrice: newAvgPrice
        }
      });
    } else {
      positionUpsert = prisma.position.create({
        data: {
          userId,
          marketId,
          outcome,
          sharesOwned: amount,
          avgEntryPrice: cost / amount
        }
      });
    }

    const [updatedUser, updatedPool, position, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { buzzCredits: { decrement: cost } }
      }),
      prisma.marketPool.update({
        where: { marketId },
        data: poolUpdateData
      }),
      positionUpsert,
      prisma.transaction.create({
        data: {
          userId,
          marketId,
          type: 'BUY',
          creditDelta: -cost,
          sharesDelta: amount
        }
      })
    ], { timeout: 10000 });

    return {
      receipt: transaction,
      position: position,
      cost: cost
    };
  }
}

module.exports = TradeProcessor;
