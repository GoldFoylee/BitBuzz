const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const BinaryMarket = require('../classes/BinaryMarket');
const { getIo } = require('../socket/index');

const listMarkets = async (req, res, next) => {
  try {
    const markets = await prisma.market.findMany({
      where: { status: 'OPEN' },
      include: { pool: true },
      orderBy: { createdAt: 'desc' }
    });

    const marketData = markets.map(m => {
      const bMarket = new BinaryMarket(m.id, m.title, m.category, m.status, m.closeTime, m.pool.yesShares, m.pool.noShares);
      return {
        ...m,
        impliedProbability: bMarket.getImpliedProbability()
      };
    });

    res.json(marketData);
  } catch (error) {
    next(error);
  }
};

const getMarket = async (req, res, next) => {
  try {
    const market = await prisma.market.findUnique({
      where: { id: req.params.id },
      include: { pool: true }
    });
    if (!market) return res.status(404).json({ error: 'Market not found' });

    const bMarket = new BinaryMarket(market.id, market.title, market.category, market.status, market.closeTime, market.pool.yesShares, market.pool.noShares);
    
    res.json({
      ...market,
      impliedProbability: bMarket.getImpliedProbability()
    });
  } catch (error) {
    next(error);
  }
};

const createMarket = async (req, res, next) => {
  try {
    const { title, category, closeTime } = req.body;
    
    const market = await prisma.market.create({
      data: {
        title,
        category,
        closeTime: new Date(closeTime),
        createdById: req.user.id,
        pool: {
          create: { yesShares: 50, noShares: 50, liquidityConstant: 100 }
        }
      },
      include: { pool: true }
    });

    res.status(201).json(market);
  } catch (error) {
    next(error);
  }
};

const settleMarket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { outcome } = req.body;

    if (!['YES', 'NO'].includes(outcome)) {
      return res.status(400).json({ error: 'Invalid outcome' });
    }

    const receipt = await prisma.$transaction(async (tx) => {
      const market = await tx.market.findUnique({ where: { id } });
      if (!market) throw new Error('Market not found');
      if (market.status === 'RESOLVED') throw new Error('Market already resolved');

      // 1. Update Market
      const updatedMarket = await tx.market.update({
        where: { id },
        data: { status: 'RESOLVED', outcome }
      });

      // 2. Payout to winners
      const winningPositions = await tx.position.findMany({
        where: { marketId: id, outcome }
      });

      for (const pos of winningPositions) {
        // Simple payout: 1 share = 1 credit upon correct prediction
        const payout = parseFloat(pos.sharesOwned);
        await tx.user.update({
          where: { id: pos.userId },
          data: { buzzCredits: { increment: payout } }
        });
        
        await tx.transaction.create({
          data: {
            userId: pos.userId,
            marketId: id,
            type: 'PAYOUT',
            creditDelta: payout,
            sharesDelta: 0
          }
        });
      }

      return updatedMarket;
    });

    try {
      getIo().to(`market:${id}`).emit('MARKET_SETTLED', { type: 'MARKET_SETTLED', outcome });
    } catch (e) {

    }

    res.json({ message: 'Market settled successfully', market: receipt });
  } catch (error) {
    next(error);
  }
};

module.exports = { listMarkets, getMarket, createMarket, settleMarket };
