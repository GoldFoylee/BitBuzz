const TradeProcessor = require('../classes/TradeProcessor');
const LMSRStrategy = require('../classes/LMSRStrategy');
const BinaryMarket = require('../classes/BinaryMarket');
const { getIo } = require('../socket/index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const executeTrade = async (req, res, next) => {
  try {
    const { marketId, outcome, amount } = req.body;
    
    // Inject strategy
    const processor = new TradeProcessor(new LMSRStrategy(100));
    
    const result = await processor.executeTrade(req.user.id, marketId, outcome, amount);

    // After trade, get updated pool to emit Socket event
    const pool = await prisma.marketPool.findUnique({ where: { marketId } });
    if (pool) {
      const bMarket = new BinaryMarket(marketId, 'title', 'category', 'OPEN', new Date(), pool.yesShares, pool.noShares);
      const prob = bMarket.getImpliedProbability();
      const newYesPrice = prob;
      const newNoPrice = 1 - prob;
      
      try {
        getIo().to(`market:${marketId}`).emit('PRICE_UPDATE', {
          type: 'PRICE_UPDATE',
          marketId,
          newYesPrice,
          newNoPrice,
          impliedProbability: prob
        });
      } catch (e) {

      }
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getPortfolio = async (req, res, next) => {
  try {
    const positions = await prisma.position.findMany({
      where: { userId: req.user.id },
      include: { market: { include: { pool: true } } }
    });

    const portfolio = positions.map(pos => {
      let currentValue = 0;
      if (pos.market.status === 'RESOLVED') {
        currentValue = pos.market.outcome === pos.outcome ? parseFloat(pos.sharesOwned) : 0;
      } else {
        const bMarket = new BinaryMarket('id', 't', 'c', 'OPEN', new Date(), pos.market.pool.yesShares, pos.market.pool.noShares);
        const probYes = bMarket.getImpliedProbability();
        const price = pos.outcome === 'YES' ? probYes : (1 - probYes);
        currentValue = parseFloat(pos.sharesOwned) * price;
      }

      const totalCost = parseFloat(pos.sharesOwned) * parseFloat(pos.avgEntryPrice);
      const pnl = currentValue - totalCost;

      return {
        ...pos,
        currentValue,
        pnl
      };
    });

    res.json(portfolio);
  } catch (error) {
    next(error);
  }
};

module.exports = { executeTrade, getPortfolio };
