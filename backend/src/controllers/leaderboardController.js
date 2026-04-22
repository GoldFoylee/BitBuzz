const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const BinaryMarket = require('../classes/BinaryMarket');

const getLeaderboard = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: { 
        positions: { 
          include: { market: { include: { pool: true } } } 
        } 
      }
    });

    const leaderboard = users.map(u => {
      let portfolioValue = 0;
      u.positions.forEach(pos => {
        if (pos.market.status === 'RESOLVED') {
           if (pos.market.outcome === pos.outcome) {
             portfolioValue += parseFloat(pos.sharesOwned);
           }
        } else {
           const bMarket = new BinaryMarket('id', 't', 'c', 'OPEN', new Date(), pos.market.pool.yesShares, pos.market.pool.noShares);
           const probYes = bMarket.getImpliedProbability();
           const price = pos.outcome === 'YES' ? probYes : (1 - probYes);
           portfolioValue += parseFloat(pos.sharesOwned) * price;
        }
      });
      const totalValue = parseFloat(u.buzzCredits) + portfolioValue;
      return {
        id: u.id,
        username: u.username,
        totalValue
      };
    });

    leaderboard.sort((a, b) => b.totalValue - a.totalValue);
    res.json(leaderboard.slice(0, 10)); // Top 10
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeaderboard };
